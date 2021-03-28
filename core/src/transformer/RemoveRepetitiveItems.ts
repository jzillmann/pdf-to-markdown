import { compareTwoStrings } from 'string-similarity';

import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import LineItemMerger from '../debug/LineItemMerger';
import {
  ascending,
  flatMap,
  groupByLine,
  groupByPage,
  median,
  mostFrequent,
  onlyUniques,
  transformGroupedByPageAndLine,
} from '../support/groupingUtils';
import { filterOutDigits } from '../support/stringFunctions';
import { flatten, groupBy } from '../support/functional';

const config = {
  // Max number of lines at top/bottom (per page) which are getting evaluated for eviction
  maxNumberOffTopOrBottomLines: 3,

  // From the absolute fringe elements (min/max y) how much y can item deviate before beeing disregarded.
  maxDistanceFromFringeElements: 35,

  // Max neighbour taken (in one direction) for detecting neighbour similarity.
  // Choosen number might be more effectful for PDFs with a strong odd/evan page differernce.
  neighbourReach: 2,

  minScore: 0.7,
};

export default class RemoveRepetitiveItems extends ItemTransformer {
  constructor() {
    super('Remove Repetitive Items', 'Remove things like page numbers or license footers.', {
      requireColumns: ['x', 'y', 'str', 'line'],
      debug: {
        itemMerger: new LineItemMerger(),
      },
    });
  }

  transform(context: TransformContext, inputItems: Item[]): ItemResult {
    const { minY, maxY } = inputItems.reduce(
      ({ minY, maxY }, item) => {
        const y = item.data['y'];
        return {
          minY: Math.min(minY, y),
          maxY: Math.max(maxY, y),
        };
      },
      { minY: 999, maxY: 0 },
    );

    const bottomMaxY = minY + config.maxDistanceFromFringeElements;
    const topMinY = maxY - config.maxDistanceFromFringeElements;
    // console.log('bottomMaxY', bottomMaxY, 'topMinY', topMinY);

    const fringeItems = inputItems.filter((item) => {
      const y = item.data['y'];
      return y <= bottomMaxY || y >= topMinY;
    });

    const fringeLines = flatMap(
      groupByPage(fringeItems).map((pageItems) =>
        groupByLine(pageItems)
          .map((lineItems) => {
            const lineY = yFromLineItems(lineItems);
            return new PageLine(pageItems[0].page, lineY, lineItems);
          })
          .sort((a, b) => a.y - b.y),
      ),
      (e) => e,
    );

    const pageNumber = detectAPageNumber(fringeLines);
    const fringeYs = fringeLines
      .map((line) => line.y)
      .filter(onlyUniques)
      .sort(ascending);

    // console.log('uniqueYs', uniqueYs);

    const yToRemove = fringeYs.filter((y) => {
      const yLines = fringeLines.filter((line) => line.y == y);
      if (yLines.length < 2) {
        return false;
      }

      const pageNumberScore: number = pageNumber ? calculatePageNumerScore(context.pageCount, pageNumber, yLines) : 0;
      const textSimilarityScore: number = textSimilarity(yLines);
      const totalScore = pageNumberScore + textSimilarityScore;
      // console.log(
      //   y,
      //   totalScore >= config.minScore,
      //   totalScore,
      //   `(${pageNumberScore} / ${textSimilarityScore})`,
      //   yLines.map((l) => l.text()),
      //   yLines.map((l) => l.page),
      // );

      // TODO more checks
      // - magnetic y
      // - exclude headlines (higher height, e.g art of speaking)
      // - better odd/even handling (e.g war of worlds || dict)
      // - same x structure
      // - contain chapter highlights
      // - contains rising number

      return totalScore >= config.minScore;
    });

    let removalCount = 0;
    return {
      items: transformGroupedByPageAndLine(inputItems, (_, __, lineItems) => {
        const itemsY = yFromLineItems(lineItems);
        if (fringeYs.includes(itemsY)) {
          lineItems.forEach(context.trackEvaluation.bind(context));
        }
        if (yToRemove.includes(itemsY)) {
          removalCount++;
          return [];
        }
        return lineItems;
      }),
      messages: [`Filtered out ${removalCount} items with y == ${yToRemove.join('||')}`],
    };
  }
}

function calculatePageNumerScore(pageCount: number, pageNumber: PageNumber, lines: PageLine[]): number {
  const pageNumberFactor = pageNumber.pageNumber - pageNumber.pageIndex;
  const maxPageNumbers = pageCount + pageNumberFactor;
  const linesWithPageNumbers = lines.filter((line) =>
    extractNumbers(line.text()).includes(line.page + pageNumberFactor),
  ).length;
  return linesWithPageNumbers / Math.min(maxPageNumbers, lines.length);
}

function detectAPageNumber(lines: PageLine[]): PageNumber | undefined {
  const linesByPage = groupBy(lines, (line) => line.page).sort((a, b) => a[0].page - b[0].page);
  const pageIndexInTheMiddle = Math.round(linesByPage.length / 2);
  const possiblePageNumbersForMiddle = possiblePageNumbers(linesByPage[pageIndexInTheMiddle]);
  const remainingOptions = filterOutIncompatibleVariant(
    possiblePageNumbersForMiddle,
    linesByPage.slice(pageIndexInTheMiddle + 1, linesByPage.length),
  );
  //TODO do the same filtering upstream !?

  if (remainingOptions.length == 1) {
    return remainingOptions[0];
  }

  return undefined;
}

function filterOutIncompatibleVariant(options: PageNumber[], nextPageLines: PageLine[][]): PageNumber[] {
  let index = 0;
  let remainingOptions = [...options];
  while (remainingOptions.length > 1 && index < nextPageLines.length) {
    const nextPageNumbers = possiblePageNumbers(nextPageLines[index]);
    if (nextPageNumbers.length > 0) {
      remainingOptions = remainingOptions.filter((option) => {
        const maxDistance = nextPageNumbers[0].pageIndex - option.pageIndex;
        return nextPageNumbers.find((nextPageNum) => nextPageNum.pageNumber - option.pageNumber <= maxDistance);
      });
    }
    index++;
  }
  return remainingOptions;
}

interface PageNumber {
  pageIndex: number;
  pageNumber: number;
  y: number;
}

function possiblePageNumbers(lines: PageLine[]): PageNumber[] {
  return flatten(
    lines.map((line) => {
      return extractNumbers(line.text())
        .filter((number) => number >= 0)
        .filter((number) => number <= line.page + 1)
        .filter(onlyUniques)
        .map((num) => ({
          pageIndex: line.page,
          pageNumber: num,
          y: line.y,
        }));
    }),
  );
}

function extractNumbers(text: string): number[] {
  return (text.match(/\d+/g) || []).map(Number);
}

function textSimilarity(lines: PageLine[]): number {
  const similarities = flatMap(lines, (line, idx) =>
    adiacentLines(lines, idx).map((adiacentLine) => calculateSimilarity(line, adiacentLine)),
  );
  return median(similarities);
}

function calculateSimilarity(line1: PageLine, line2: PageLine): number {
  return compareTwoStrings(line1.textWithoutNumbers(), line2.textWithoutNumbers());
}

function adiacentLines(lines: PageLine[], index: number): PageLine[] {
  // Prefer to either collect x downstream OR x upstream neighbours (not a mix) in order to better catch odd/even page differences
  let neighbours: PageLine[];
  if (index + config.neighbourReach < lines.length) {
    neighbours = lines.slice(index + 1, index + config.neighbourReach + 1);
  } else if (index - config.neighbourReach >= 0) {
    neighbours = lines.slice(index - config.neighbourReach - 1, index - 1);
  } else {
    neighbours = lines.filter((_, idx) => idx !== index);
  }

  return neighbours;
}

function yFromLineItems(lineItems: Item[]): number {
  return Math.round(mostFrequent(lineItems, 'y') as number);
}

/**
 * A number of Items on a line (~same y) on a page.
 */
class PageLine {
  private _text: string | undefined;
  private _textWithoutNumbers: string | undefined;

  constructor(public page: number, public y: number, public items: Item[]) {}

  text(): string {
    if (!this._text) {
      this._text = this.items.reduce((all, item) => all + item.data['str'], '');
    }
    return this._text;
  }

  textWithoutNumbers(): string {
    if (!this._textWithoutNumbers) {
      this._textWithoutNumbers = filterOutDigits(this.text());
    }
    return this._textWithoutNumbers;
  }
}

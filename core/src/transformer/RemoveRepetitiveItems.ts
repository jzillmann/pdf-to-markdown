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

const config = {
  // Max number of lines at top/bottom (per page) which are getting evaluated for eviction
  maxNumberOffTopOrBottomLines: 3,

  // From the absolute fringe elements (min/max y) how much y can item deviate before beeing disregarded.
  maxDistanceFromFringeElements: 30,

  // Max neighbour taken (in one direction) for detecting neighbour similarity.
  // Choosen number might be more effectful for PDFs with a strong odd/evan page differernce.
  neighbourReach: 2,

  minSimilarity: 0.8,

  minScore: 0.9,
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
    const fringeLines = extractFringeLines(inputItems);

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

      const allNumbersJoined = flatMap(
        yLines
          .map((line) => {
            const match = line.text().match(/\d+/g);
            return match?.map(Number) as number[];
          })
          .filter((match) => typeof match !== 'undefined'),
        (e) => e,
      ).join('-');
      const regularNumbersJoined = Array.from({ length: yLines.length }, (_, i) => i + 1).join('-');

      //TODO OR... reduce (compare last with current == pre-1 100 punkte, current > pre 50 Punkte, sonst 0 punkte und reset. Dann zusammenzählen.)
      const consecutiveNumberScores = consecutiveNumbers(yLines);
      const allNumberScore: number = isAllNumbers(yLines) ? 1 : 0;
      const textSimilarityScore: number = textSimilarity(yLines);

      const totalScore = consecutiveNumberScores + allNumberScore + textSimilarityScore;
      // console.log(
      //   y,
      //   yLines.map((l) => l.text()),
      //   consecutiveNumberScores,
      //   allNumberScore,
      //   textSimilarityScore,
      //   '=',
      //   totalScore,
      // );
      // console.log(y, 'numbers', allNumbers);
      // console.log(y, 'regularNumbers', regularNumbers);

      // TODO more checks
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

function consecutiveNumbers(lines: PageLine[]): number {
  const allNumbersJoined = flatMap(
    lines
      .map((line) => {
        const match = line.text().match(/\d+/g);
        return match?.map(Number) as number[];
      })
      .filter((match) => typeof match !== 'undefined'),
    (e) => e,
  ).join('-');
  const regularNumbersJoined = Array.from({ length: lines.length }, (_, i) => i + 1).join('-');

  //TODO OR... reduce (compare last with current == pre-1 100 punkte, current > pre 50 Punkte, sonst 0 punkte und reset. Dann zusammenzählen.)
  return compareTwoStrings(allNumbersJoined, regularNumbersJoined);
}

function textSimilarity(lines: PageLine[]): number {
  const similarities = flatMap(lines, (line, idx) =>
    adiacentLines(lines, idx).map((adiacentLine) => calculateSimilarity(line, adiacentLine)),
  );
  return median(similarities);
}

function isAllNumbers(lines: PageLine[]): boolean {
  for (let index = 0; index < lines.length; index++) {
    const string = lines[index].text().trim();
    const asNumber = Number(string);
    if (isNaN(asNumber)) {
      return false;
    }
  }
  return true;
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

function extractFringeLines(inputItems: Item[]): PageLine[] {
  let bottomY = 999;
  let topY = 0;

  const fringLines = flatMap(
    groupByPage(inputItems).map((pageItems) => {
      const pageLines = groupByLine(pageItems)
        .map((lineItems) => {
          const lineY = yFromLineItems(lineItems);
          return new PageLine(pageItems[0].page, lineY, lineItems);
        })
        .sort((a, b) => a.y - b.y);

      // Keep globals up to date
      if (pageLines[0].y < bottomY) {
        bottomY = pageLines[0].y;
      }
      if (pageLines[pageLines.length - 1].y > topY) {
        topY = pageLines[pageLines.length - 1].y;
      }

      // keep only top and bottom fringes
      const numberOfFringeElements = Math.min(pageLines.length, config.maxNumberOffTopOrBottomLines);
      const bottomN = pageLines.slice(0, numberOfFringeElements);
      const topN = pageLines.slice(pageLines.length - numberOfFringeElements, pageLines.length);
      return [...bottomN, ...topN].filter(onlyUniques);
    }),
    (e) => e,
  );

  // console.log('bottom', bottomY);
  // console.log('top', topY);

  //Now that we now the global top and bottom y, we cut those y which are in the middle and not really on the fringes
  const maxTopDistance = config.maxDistanceFromFringeElements;
  const maxBottomDistance = config.maxDistanceFromFringeElements;
  return fringLines.filter((line) => line.y <= bottomY + maxBottomDistance || line.y >= topY - maxTopDistance);
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

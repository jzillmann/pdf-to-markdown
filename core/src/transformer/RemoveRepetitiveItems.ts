import { compareTwoStrings } from 'string-similarity';

import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import LineItemMerger from '../debug/LineItemMerger';
import {
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
    const pageExtracts = buildExtracts(inputItems);

    const uniqueYs = flatMap(pageExtracts, (extract) => extract.fringeLines)
      .map((line) => line.y)
      .filter(onlyUniques)
      .sort((a, b) => a - b);

    // console.log('uniqueYs', uniqueYs);

    const yToRemove = uniqueYs.filter((y) => {
      const yLines = pageExtracts
        .map((page) => page.lineByY(y))
        .filter((line) => typeof line !== 'undefined') as Line[];

      const similarities = flatMap(yLines, (line, idx) =>
        adiacentLines(yLines, idx).map((adiacentLine) => calculateSimilarity(line, adiacentLine)),
      );

      // TODO more checks
      // - exclude headlines (higher height, e.g art of speaking)
      // - better odd/even handling (e.g war of worlds || dict)
      // - same x structure
      // - contain chapter highlights
      // - contains rising number

      // const texts = yLines.map((line) => line.text());
      // console.log('y' + y, texts, similarities, median(similarities));
      return median(similarities) >= config.minSimilarity;
    });

    //console.log('yToRemove', yToRemove);

    return {
      items: transformGroupedByPageAndLine(inputItems, (_, __, items) =>
        yToRemove.includes(yFromLine(items)) ? [] : items,
      ),
      messages: [`Filtered out each item with y == ${yToRemove.join('||')}`],
    };
  }
}

function calculateSimilarity(line1: Line, line2: Line): number {
  return compareTwoStrings(line1.textWithoutNumbers(), line2.textWithoutNumbers());
}

function adiacentLines(lines: Line[], index: number): Line[] {
  // Prefer to either collect x downstream OR x upstream neighbours (not a mix) in order to better catch odd/even page differences
  let neighbours: Line[];
  if (index + config.neighbourReach < lines.length) {
    neighbours = lines.slice(index + 1, index + config.neighbourReach + 1);
  } else if (index - config.neighbourReach >= 0) {
    neighbours = lines.slice(index - config.neighbourReach - 1, index - 1);
  } else {
    neighbours = lines.filter((_, idx) => idx !== index);
  }

  return neighbours;
}

function buildExtracts(inputItems: Item[]): PageExtract[] {
  let bottomY = 999;
  let topY = 0;

  const pages = groupByPage(inputItems).map((pageItems) => {
    const lines = groupByLine(pageItems)
      .map((lineItems) => {
        const lineY = yFromLine(lineItems);
        return new Line(lineY, lineItems);
      })
      .sort((a, b) => a.y - b.y);

    // Keep globals up to date
    if (lines[0].y < bottomY) {
      bottomY = lines[0].y;
    }
    if (lines[lines.length - 1].y > topY) {
      topY = lines[lines.length - 1].y;
    }

    // keep top and bottom fringes
    const numberOfFringeElements = Math.min(lines.length, config.maxNumberOffTopOrBottomLines);
    const bottomN = lines.slice(0, numberOfFringeElements);
    const topN = lines.slice(lines.length - numberOfFringeElements, lines.length);

    const fringeLines = [...bottomN, ...topN].filter(onlyUniques);
    return new PageExtract(pageItems[0].page, fringeLines);
  });

  // console.log('bottom', bottomY);
  // console.log('top', topY);

  //Now that we now the global top and bottom y, we cut those y which are in the middle and not really on the fringes
  const maxTopDistance = config.maxDistanceFromFringeElements;
  const maxBottomDistance = config.maxDistanceFromFringeElements;
  return pages.map(
    (page) =>
      new PageExtract(
        page.page,
        page.fringeLines.filter((line) => line.y <= bottomY + maxBottomDistance || line.y >= topY - maxTopDistance),
      ),
  );
}

function yFromLine(lineItems: Item[]): number {
  return Math.round(mostFrequent(lineItems, 'y') as number);
}

class PageExtract {
  constructor(public page: number, public fringeLines: Line[]) {}

  hasY(y: number): boolean {
    return this.fringeLines.findIndex((line) => line.y === y) >= 0;
  }

  lineByY(y: number): Line | undefined {
    return this.fringeLines.find((line) => line.y === y);
  }
}

class Line {
  private _text: string | undefined;
  private _textWithoutNumbers: string | undefined;

  constructor(public y: number, public items: Item[]) {}

  text() {
    if (!this._text) {
      this._text = this.items.reduce((all, item) => all + item.data['str'], '');
    }
    return this._text;
  }

  textWithoutNumbers() {
    if (!this._textWithoutNumbers) {
      this._textWithoutNumbers = filterOutDigits(this.text());
    }
    return this._textWithoutNumbers;
  }
}

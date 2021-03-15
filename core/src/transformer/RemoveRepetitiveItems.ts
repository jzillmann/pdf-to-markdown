import { compareTwoStrings } from 'string-similarity';

import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import LineItemMerger from '../debug/LineItemMerger';
import {
  count,
  flatMap,
  groupByLine,
  groupByPage,
  median,
  mostFrequent,
  onlyUnique,
  transformGroupedByPageAndLine,
} from '../support/groupingUtils';
import { filterOutDigits } from '../support/stringFunctions';

const config = {
  // Max number of lines at top/bottom which are getting evaluated for eviction
  maxNumberOffTopOrBottomLines: 3,

  // Minumum number of times in percent that the y has to appear as fringe element in a page
  minYOccurence: 0.6,

  // Max neighbour hops in both direction when checking for neighbour similarity
  neighbourReach: 3,

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
      .filter(onlyUnique);

    const numberOfPages = context.pageViewports.length;

    const yToRemove = uniqueYs.filter((y) => {
      // First check how often an element occurs on the given 'y'.
      // Repetetive elements tend to be on the same y all the time or half the time.
      const pageOccurence = count(pageExtracts, (extraxt) => extraxt.hasY(y));

      const simis = pageExtracts.map((extraxt, idx) => {
        const line = extraxt.lineByY(y);
        if (line) {
          const neighbours = neighbourLines(pageExtracts, idx, y);
          const similarities = neighbours.map((nLine) => calculateSimilarity(line, nLine));
          return median(similarities);
        }
        return 0;
      });

      // TODO more checks
      // - same x structure
      // - contain chapter highlights
      // - contains rising number

      return pageOccurence >= numberOfPages * config.minYOccurence && median(simis) >= config.minSimilarity;
    });

    return {
      items: transformGroupedByPageAndLine(inputItems, (_, __, items) =>
        yToRemove.includes(yFromLine(items)) ? [] : items,
      ),
      messages: [`Filtered out each item with y == ${yToRemove.join('||')}`],
    };
  }
}

function calculateSimilarity(line1: Line, line2: Line): number {
  return compareTwoStrings(line1.asStringWithoutNumbers, line2.asStringWithoutNumbers);
}

function neighbourLines(pages: PageExtract[], pageIndex: number, y: number): Line[] {
  const neighbourLines: Line[] = [];

  //Upstream
  for (let index = pageIndex - 1; index > -1 && index >= pageIndex - config.neighbourReach; index--) {
    const neighbourLine = pages[index].lineByY(y);
    if (neighbourLine) {
      neighbourLines.push(neighbourLine);
    }
  }

  //Downstream
  for (let index = pageIndex + 1; index < pages.length && index <= pageIndex + config.neighbourReach; index++) {
    const neighbourLine = pages[index].lineByY(y);
    if (neighbourLine) {
      neighbourLines.push(neighbourLine);
    }
  }

  return neighbourLines;
}

function buildExtracts(inputItems: Item[]): PageExtract[] {
  const pageExtracts = groupByPage(inputItems).map((pageItems) => {
    const lines = groupByLine(pageItems).map((lineItems) => {
      const lineY = yFromLine(lineItems);
      return new Line(lineY, lineItems);
    });
    lines.sort((a, b) => {
      return a.y - b.y;
    });

    const numberOfFringeElements = Math.min(lines.length, config.maxNumberOffTopOrBottomLines);
    const topN = lines.slice(0, numberOfFringeElements);
    const lastN = lines.slice(lines.length - numberOfFringeElements, lines.length);
    const fringeLines = [...topN, ...lastN].filter((line, idx, array) => array.indexOf(line) === idx);
    return new PageExtract(pageItems[0].page, fringeLines);
  });

  return pageExtracts;
}

function yFromLine(lineItems: Item[]): number {
  return mostFrequent(lineItems, 'y') as number;
}

class Line {
  asString: string;
  asStringWithoutNumbers: string;
  constructor(public y: number, public items: Item[]) {
    this.asString = items.reduce((all, item) => all + item.data['str'], '');
    this.asStringWithoutNumbers = filterOutDigits(this.asString);
  }
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

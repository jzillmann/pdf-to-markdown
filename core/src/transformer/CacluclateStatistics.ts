import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import FontType from '../FontType';
import GlobalDefinition from '../GlobalDefinition';
import PageMapping from '../PageMapping';
import PageFactorFinder from '../support/PageFactorFinder';
import { groupByPage, onlyUniques } from '../support/groupingUtils';
import { flatten } from '../support/functional';
import { extractNumbers } from '../support/stringFunctions';

import { median } from 'simple-statistics';

export const MIN_X = new GlobalDefinition<number>('minX');
export const MAX_X = new GlobalDefinition<number>('maxX');
export const MIN_Y = new GlobalDefinition<number>('minY');
export const MAX_Y = new GlobalDefinition<number>('maxY');
export const MAX_HEIGHT = new GlobalDefinition<number>('maxHeight');
export const MOST_USED_HEIGHT = new GlobalDefinition<number>('mostUsedHeight');
export const PAGE_MAPPING = new GlobalDefinition<PageMapping>('pageMapping');

const config = {
  // how much distance to min/max/x/y can an item have in order to be considered fringe
  maxDistanceToFringe: 50,
};

export default class CalculateStatistics extends ItemTransformer {
  constructor() {
    super('Calculate Statistics', 'Calculate global statistics that are used in downstream transformers', {
      requireColumns: ['str', 'fontName', 'y', 'height'],
      producesGlobels: [
        'mostUsedHeight',
        'mostUsedFont',
        'mostUsedDistance',
        'maxHeight',
        'maxHeightFont',
        'fontToFormats',
      ],
      debug: {
        showAll: true,
      },
    });
  }

  transform(context: TransformContext, items: Item[]): ItemResult {
    const heights = items.map((item) => item.data['height'] as number);
    const mostUsedByMedian = median(heights);
    // const heightToOccurrence: { [key: string]: number } = {};
    const heightToOccurrence = {};
    const fontToOccurrence = {};
    let maxHeight = 0;
    let maxHeightFont: string;
    let minX = 999;
    let maxX = 0;
    let minY = 999;
    let maxY = 0;

    items.forEach((item) => {
      const itemHeight = item.data['height'];
      const itemFont = item.data['fontName'];
      const x = item.data['x'];
      const y = item.data['y'];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      heightToOccurrence[itemHeight] = heightToOccurrence[itemHeight] ? heightToOccurrence[itemHeight] + 1 : 1;
      fontToOccurrence[itemFont] = fontToOccurrence[itemFont] ? fontToOccurrence[itemFont] + 1 : 1;
      if (itemHeight > maxHeight) {
        maxHeight = itemHeight;
        maxHeightFont = itemFont;
      }
    });
    // TODO really need parseInt here ?
    const mostUsedHeight = parseInt(getMostUsedKey(heightToOccurrence));
    const mostUsedFont = getMostUsedKey(fontToOccurrence);

    const groupedByPage = groupByPage(items);
    const pageMapping = parsePageMapping(groupedByPage, minX, maxX, minY, maxY);

    // Parse line distances
    const distanceToOccurrence = {};

    let page = -1;
    let lastItemOfMostUsedHeight: Item | undefined;
    items.forEach((item) => {
      if (item.page !== page) lastItemOfMostUsedHeight = undefined;
      const itemHeight = item.data['height'];
      const itemText = item.data['str'];
      const itemY = item.data['y'];
      if (itemHeight == mostUsedHeight && itemText.trim().length > 0) {
        if (lastItemOfMostUsedHeight && itemY != lastItemOfMostUsedHeight.data['y']) {
          const distance = lastItemOfMostUsedHeight.data['y'] - itemY;
          if (distance > 0) {
            distanceToOccurrence[distance] = distanceToOccurrence[distance] ? distanceToOccurrence[distance] + 1 : 1;
          }
        }
        lastItemOfMostUsedHeight = item;
      } else {
        lastItemOfMostUsedHeight = undefined;
      }
      page = item.page;
    });
    // const mostUsedDistance = parseInt(getMostUsedKey(distanceToOccurrence));

    const fontIdToName: string[] = [];
    const fontToType = new Map<string, FontType>();
    context.fontMap.forEach(function (value, key) {
      const fontName = value['name'];
      fontIdToName.push(`${key}  = ${fontName}`);
      const formatType = getFormatType(key, fontName, mostUsedFont, maxHeightFont);
      if (formatType) {
        fontToType.set(key, formatType);
      }
    });
    fontIdToName.sort();

    return {
      items: items,
      globals: [
        MAX_HEIGHT.value(maxHeight),
        MOST_USED_HEIGHT.value(mostUsedByMedian),
        MIN_X.value(minX),
        MAX_X.value(maxX),
        MIN_Y.value(minY),
        MAX_Y.value(maxY),
        PAGE_MAPPING.value(pageMapping),
      ],
      // globals2: {
      //   mostUsedHeight: mostUsedHeight,
      //   mostUsedFont: mostUsedFont,
      //   mostUsedDistance: mostUsedDistance,
      //   maxHeightFont: maxHeightFont,
      //   fontToFormats: fontToType,
      // },
      messages: [
        'Items per height: ' + JSON.stringify(heightToOccurrence),
        'Items per font: ' + JSON.stringify(fontToOccurrence),
        'Items per distance: ' + JSON.stringify(distanceToOccurrence),
        'Fonts:' + JSON.stringify(fontIdToName),
      ],
    };
  }
}

function parsePageMapping(
  groupedByPage: Item[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): PageMapping {
  const pageFactor = new PageFactorFinder().find(
    groupedByPage,
    (items) => ({
      index: items[0].page,
      numbers: possiblePageNumbers(
        items.filter((item: Item) => {
          const x = item.data['x'];
          const y = item.data['y'];
          return (
            x <= minX + config.maxDistanceToFringe ||
            x >= maxX - config.maxDistanceToFringe ||
            y <= minY + config.maxDistanceToFringe ||
            y >= maxY - config.maxDistanceToFringe
          );
        }),
      ),
    }),
    { sampleCount: 20, minFulfillment: 0.8 },
  );
  return typeof pageFactor === 'undefined' ? new PageMapping() : new PageMapping(pageFactor, true);
}

function getMostUsedKey(keyToOccurrence: Record<string, number>): string {
  let maxOccurence = 0;
  let maxKey: string = '';
  Object.keys(keyToOccurrence).map((element) => {
    if (!maxKey || keyToOccurrence[element] > maxOccurence) {
      maxOccurence = keyToOccurrence[element];
      maxKey = element;
    }
  });
  return maxKey;
}

function getFormatType(
  fontId: string,
  fontName: string,
  mostUsedFont: string | undefined,
  maxHeightFont: string | undefined,
): FontType | undefined {
  const fontNameLowerCase = fontName.toLowerCase();
  if (fontId == mostUsedFont) {
    return undefined;
  } else if (
    fontNameLowerCase.includes('bold') &&
    (fontNameLowerCase.includes('oblique') || fontNameLowerCase.includes('italic'))
  ) {
    return FontType.BOLD_OBLIQUE;
  } else if (fontNameLowerCase.includes('bold')) {
    return FontType.BOLD;
  } else if (fontNameLowerCase.includes('oblique') || fontNameLowerCase.includes('italic')) {
    return FontType.OBLIQUE;
  } else if (fontId === maxHeightFont) {
    //TODO this was the wrong comparision in old app and thus never returned as bold probably
    return FontType.BOLD;
  }
}

function possiblePageNumbers(items: Item[]): number[] {
  return flatten(
    items.map((item) => {
      return (
        extractNumbers(item.data['str'])
          .filter((number) => number >= 0)
          // .filter((number) => number <= line.page + 1)
          .filter(onlyUniques)
      );
    }),
  );
}
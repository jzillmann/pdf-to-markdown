import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import FontType from '../FontType';

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
    });
  }

  transform(context: TransformContext, items: Item[]): ItemResult {
    // const heightToOccurrence: { [key: string]: number } = {};
    const heightToOccurrence = {};
    const fontToOccurrence = {};
    let maxHeight = 0;
    let maxHeightFont;

    items.forEach((inputItems) => {
      const itemHeight = inputItems.data['height'];
      const itemFont = inputItems.data['fontName'];
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
    const mostUsedDistance = parseInt(getMostUsedKey(distanceToOccurrence));

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
      globals: {
        mostUsedHeight: mostUsedHeight,
        mostUsedFont: mostUsedFont,
        mostUsedDistance: mostUsedDistance,
        maxHeight: maxHeight,
        maxHeightFont: maxHeightFont,
        fontToFormats: fontToType,
      },
      messages: [
        'Items per height: ' + JSON.stringify(heightToOccurrence),
        'Items per font: ' + JSON.stringify(fontToOccurrence),
        'Items per distance: ' + JSON.stringify(distanceToOccurrence),
        'Fonts:' + JSON.stringify(fontIdToName),
      ],
    };
  }
}

function getMostUsedKey(keyToOccurrence): any {
  var maxOccurence = 0;
  var maxKey: string | undefined;
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

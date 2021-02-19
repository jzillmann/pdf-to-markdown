import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';

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
        // 'fontToFormats',
      ],
    });
  }

  transform(_: TransformContext, items: Item[]): ItemResult {
    const heightToOccurrence = {};
    const fontToOccurrence = {};
    let maxHeight = 0;
    let maxHeightFont;

    items.forEach((item) => {
      const itemHeight = item.data['height'];
      const itemFont = item.data['fontName'];
      heightToOccurrence[itemHeight] = heightToOccurrence[itemHeight] ? heightToOccurrence[itemHeight] + 1 : 1;
      fontToOccurrence[itemFont] = fontToOccurrence[itemFont] ? fontToOccurrence[itemFont] + 1 : 1;
      if (itemHeight > maxHeight) {
        maxHeight = itemHeight;
        maxHeightFont = itemFont;
      }
    });
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
        console.log('__', itemY, lastItemOfMostUsedHeight);

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

    // const fontIdToName = [];
    // const fontToFormats = new Map();
    // this.fontMap.forEach(function (value, key) {
    //   fontIdToName.push(key + ' = ' + value.name);
    //   const fontName = value.name.toLowerCase();
    //   var format;
    //   if (key == mostUsedFont) {
    //     format = null;
    //   } else if (fontName.includes('bold') && (fontName.includes('oblique') || fontName.includes('italic'))) {
    //     format = WordFormat.BOLD_OBLIQUE;
    //   } else if (fontName.includes('bold')) {
    //     format = WordFormat.BOLD;
    //   } else if (fontName.includes('oblique') || fontName.includes('italic')) {
    //     format = WordFormat.OBLIQUE;
    //   } else if (fontName === maxHeightFont) {
    //     format = WordFormat.BOLD;
    //   }
    //   if (format) {
    //     fontToFormats.set(key, format.name);
    //   }
    // });
    // fontIdToName.sort();

    return {
      items: items,
      globals: {
        mostUsedHeight: mostUsedHeight,
        mostUsedFont: mostUsedFont,
        mostUsedDistance: mostUsedDistance,
        maxHeight: maxHeight,
        maxHeightFont: maxHeightFont,
        // fontToFormats: fontToFormats,
      },
      messages: [
        'Items per height: ' + JSON.stringify(heightToOccurrence),
        'Items per font: ' + JSON.stringify(fontToOccurrence),
        'Items per distance: ' + JSON.stringify(distanceToOccurrence),
        // 'Fonts:' + JSON.stringify(fontIdToName),
      ],
    };
  }
}

function getMostUsedKey(keyToOccurrence) {
  var maxOccurence = 0;
  var maxKey;
  Object.keys(keyToOccurrence).map((element) => {
    if (!maxKey || keyToOccurrence[element] > maxOccurence) {
      maxOccurence = keyToOccurrence[element];
      maxKey = element;
    }
  });
  return maxKey;
}

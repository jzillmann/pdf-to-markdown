import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import LineItemMerger from '../debug/LineItemMerger';
import { groupByLine, onlyUniques } from '../support/groupingUtils';
import { MAX_HEIGHT, MOST_USED_DISTANCE, MOST_USED_FONT, MOST_USED_HEIGHT } from './CacluclateStatistics';
import { HEADLINE_TYPE_TO_HEIGHT_RANGE, TOC_GLOBAL } from './DetectToc';
import ItemType from '../ItemType';
import { flatten } from '../support/functional';
import { itemWithType } from '../support/items';

const config = {
  // How much taller a text must be to be a headline (relative to mostUsedHeight)
  // TODO sync with DetectHeadline ??
  minHeadlineDistance: 1.3,
};

export default class DetectHeaders extends ItemTransformer {
  constructor() {
    super('Detect Headers', 'Detect Headers from Level 1 to 6', {
      requireColumns: ['str', 'y', 'height', 'line', 'fontName'],
      debug: {
        // showAll: true,
        itemMerger: new LineItemMerger(false),
      },
    });
  }

  transform(context: TransformContext, inputItems: Item[]): ItemResult {
    const maxHeight = context.getGlobal(MAX_HEIGHT);
    const mostUsedHeight = context.getGlobal(MOST_USED_HEIGHT);
    const mostUsedDistance = context.getGlobal(MOST_USED_DISTANCE);
    const mostUsedFont = context.getGlobal(MOST_USED_FONT);
    const toc = context.getGlobalOptionally(TOC_GLOBAL);
    const headlineTypeToHeightRange = context.getGlobalOptionally(HEADLINE_TYPE_TO_HEIGHT_RANGE);

    const itemsByLine = groupByLine(inputItems);
    const itemToLevel: Map<string, ItemType> = new Map();

    // Handle title pages: Title pages often have multiple lines of extraordinary height.
    // Starting the leveling here would already consume most of the available headline levels.
    // Thus we handle those pages seperatly and make the biggest lines #1 and all others #2.
    const maxTitlePage = toc ? toc.startPage() : Math.min(5, context.pageCount - 3);
    let detectedHeaders = detectTitlePageHeaders(
      inputItems,
      itemsByLine,
      maxTitlePage,
      mostUsedHeight,
      maxHeight,
      itemToLevel,
    );

    if (toc && headlineTypeToHeightRange) {
      //Use existing headline heights to find additional headlines
      const headlineTypes = Object.keys(headlineTypeToHeightRange) as ItemType[];
      headlineTypes.forEach((headlineType) => {
        const range = headlineTypeToHeightRange[headlineType];
        if (range.max > mostUsedHeight) {
          //use only very clear headlines, only use max
          inputItems.forEach((item) => {
            const itemHeight = item.data['height'];
            const types: ItemType[] = item.data['types'] || [];
            const isHeader =
              types.includes(ItemType.H1) ||
              types.includes(ItemType.H2) ||
              types.includes(ItemType.H3) ||
              types.includes(ItemType.H4) ||
              types.includes(ItemType.H5) ||
              types.includes(ItemType.H6);
            if (!isHeader && itemHeight === range.max) {
              itemToLevel.set(item.uuid, headlineType);
              detectedHeaders++;
            }
          });
        }
      });
    } else {
      //Categorize headlines by the text heights
      const heights: number[] = [];

      itemsByLine
        .filter((lineItems) => !itemToLevel.has(lineItems[0].uuid))
        .map((lineItems) => {
          const maxHeight = Math.max(...lineItems.map((item) => item.data['height']));
          if (maxHeight > mostUsedHeight * config.minHeadlineDistance && !heights.includes(maxHeight)) {
            heights.push(maxHeight);
          }
        });
      const heightToHeadline: Map<number, ItemType> = new Map();
      heights.sort((a, b) => b - a);

      heights.forEach((height, i) => {
        const headlineLevel = i + 2;
        if (headlineLevel <= 6) {
          const headlineType = ItemType.header(2 + i);
          heightToHeadline.set(height, headlineType);
        }
      });

      itemsByLine
        .filter((lineItems) => !itemToLevel.has(lineItems[0].uuid))
        .forEach((lineItems) => {
          const maxHeight = Math.max(...lineItems.map((item) => item.data['height']));
          const types = flatten(lineItems.map((item) => item.data['types'] || [])).filter(onlyUniques);
          const headlineType = heightToHeadline.get(maxHeight);
          if (headlineType && !types.includes(ItemType.H1) && !types.includes(ItemType.H2)) {
            lineItems.forEach((item) => itemToLevel.set(item.uuid, headlineType));
            detectedHeaders++;
          }
        });
    }

    // TODO find headlines which have paragraph height
    // var smallesHeadlineLevel = 1;
    // parseResult.pages.forEach((page) => {
    //   page.items.forEach((item) => {
    //     if (item.type && item.type.headline) {
    //       smallesHeadlineLevel = Math.max(smallesHeadlineLevel, item.type.headlineLevel);
    //     }
    //   });
    // });
    // if (smallesHeadlineLevel < 6) {
    //   const nextHeadlineType = headlineByLevel(smallesHeadlineLevel + 1);
    //   parseResult.pages.forEach((page) => {
    //     var lastItem;
    //     page.items.forEach((item) => {
    //       if (
    //         !item.type &&
    //         item.height == mostUsedHeight &&
    //         item.font !== mostUsedFont &&
    //         (!lastItem ||
    //           lastItem.y < item.y ||
    //           (lastItem.type && lastItem.type.headline) ||
    //           lastItem.y - item.y > mostUsedDistance * 2) &&
    //         item.text() === item.text().toUpperCase()
    //       ) {
    //         detectedHeaders++;
    //         item.annotation = DETECTED_ANNOTATION;
    //         item.type = nextHeadlineType;
    //       }
    //       lastItem = item;
    //     });
    //   });
    // }

    return {
      items: inputItems.map((item) => {
        const headerType = itemToLevel.get(item.uuid);
        if (headerType) {
          return itemWithType(item, headerType);
        }
        return item;
      }),
      messages: [`Detected ${detectedHeaders} headers`],
    };
  }
}

function detectTitlePageHeaders(
  inputItems: Item[],
  itemsByLine: Item[][],
  maxTitlePage: number,
  mostUsedHeight: number,
  maxHeight: number,
  itemToLevel: Map<string, ItemType>,
): number {
  const min2ndLevelHeaderHeigthOnMaxPage = mostUsedHeight + (maxHeight - mostUsedHeight) / 4;
  const pagesHavingMaxHeightItems = inputItems
    .filter((item) => item.page <= maxTitlePage)
    .filter((item) => item.data['height'] === maxHeight)
    .map((item) => item.page)
    .filter(onlyUniques);
  let detectedHeaders = 0;
  itemsByLine
    .filter((items) => pagesHavingMaxHeightItems.includes(items[0].page))
    .forEach((lineItems) => {
      const height = Math.max(...lineItems.map((item) => item.data['height']));
      if (height > min2ndLevelHeaderHeigthOnMaxPage) {
        if (height == maxHeight) {
          lineItems.forEach((item) => itemToLevel.set(item.uuid, ItemType.H1));
        } else {
          lineItems.forEach((item) => itemToLevel.set(item.uuid, ItemType.H2));
        }
        detectedHeaders++;
      }
    });
  return detectedHeaders;
}

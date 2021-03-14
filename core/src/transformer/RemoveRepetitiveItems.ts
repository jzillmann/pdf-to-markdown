import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import LineItemMerger from '../debug/LineItemMerger';
import { transformGroupedByPage, transformGroupedByPageAndLine } from '../support/groupingUtils';

export default class RemoveRepetitiveItems extends ItemTransformer {
  constructor() {
    super('Remove Repetitive Items', 'Remove things like page numbers or license footers.', {
      requireColumns: ['x', 'y', 'str'],
      debug: {
        itemMerger: new LineItemMerger(),
      },
    });
  }

  transform(context: TransformContext, inputItems: Item[]): ItemResult {
    const fringeOccurences = determineYMinAndMaxForPages(inputItems);
    console.log(fringeOccurences);

    const yToRemove: number[] = [];
    //TODO should be context.pageViewports.length == totalPages
    if (fringeOccurences.topY.occurence > (context.pageViewports.length / 3) * 2) {
      yToRemove.push(fringeOccurences.topY.y);
    }
    if (fringeOccurences.bottomY.occurence > (context.pageViewports.length / 3) * 2) {
      yToRemove.push(fringeOccurences.bottomY.y);
    }

    return {
      items: inputItems.filter((item) => !yToRemove.includes(item.data['y'])),
      messages: [`Filtered out each item with y == ${yToRemove.join('||')}`],
    };
  }
}

function determineYMinAndMaxForPages(inputItems: Item[]) {
  const occurencePerPage: Map<number, number> = new Map();
  let globalBottomY = 999;
  let globalTopY = 0;
  transformGroupedByPage(inputItems, (_, pageItems) => {
    let pageMinY = 999;
    let pageMaxY = 0;
    pageItems.forEach((item) => {
      const y = item.data['y'];
      pageMinY = Math.min(y, pageMinY);
      pageMaxY = Math.max(y, pageMaxY);
    });

    const occurenceMin = occurencePerPage.get(pageMinY) || 0;
    const occurenceMax = occurencePerPage.get(pageMaxY) || 0;
    occurencePerPage.set(pageMinY, occurenceMin + 1);
    occurencePerPage.set(pageMaxY, occurenceMax + 1);
    globalBottomY = Math.min(pageMinY, globalBottomY);
    globalTopY = Math.max(pageMaxY, globalTopY);
    return [];
  });

  return {
    bottomY: {
      y: globalBottomY,
      occurence: occurencePerPage.get(globalBottomY) || 0,
    },
    topY: {
      y: globalTopY,
      occurence: occurencePerPage.get(globalTopY) || 0,
    },
  };
}

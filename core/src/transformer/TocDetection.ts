import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import LineItemMerger from '../debug/LineItemMerger';
import { groupByLine, groupByPage } from '../support/groupingUtils';
import { PAGE_MAPPING } from './CacluclateStatistics';
import { extractEndingNumber } from '../support/stringFunctions';
import ElementType from '../ElementType';

const config = {
  maxSkips: 1,
};
export default class TocDetection extends ItemTransformer {
  constructor() {
    super(
      'TOC Detection',
      'Detect table of contents.',
      {
        requireColumns: ['x', 'y', 'str', 'line'],
        debug: {
          itemMerger: new LineItemMerger(),
        },
      },
      (incomingSchema) => {
        return incomingSchema.reduce((schema, column) => {
          if (column === 'x') {
            return [...schema, 'type', 'x'];
          }
          return [...schema, column];
        }, new Array<string>());
      },
    );
  }

  //TODO produces global TOC with pages and min/max y coordinates ?
  // Or first block producer ?
  transform(context: TransformContext, inputItems: Item[]): ItemResult {
    const pageMapping = context.getGlobal(PAGE_MAPPING);

    const maxPageToEvaluate = Math.min(context.pageCount / 2, 5 + Math.abs(pageMapping.pageFactor));
    const pagesToEvaluate = groupByPage(inputItems.filter((item) => item.page <= maxPageToEvaluate));

    const maxPageToBeLinkedTo = context.pageCount + pageMapping.pageFactor - 1;
    const tocLineUuids = new Set<string>();
    pagesToEvaluate.forEach((pageItems, pageIndex) => {
      const itemsGroupedByLine = groupByLine(pageItems);
      let potentialLines: Item[][] = [];
      let skips = 0;
      let numbers: number[] = [];
      let skippedLine: Item[] | undefined;
      itemsGroupedByLine.forEach((lineItems) => {
        const text = lineItems.reduce((text, item) => {
          return text + item.data['str'];
        }, '');
        const number = extractEndingNumber(text);
        if (number && Number.isInteger(number) && number <= maxPageToBeLinkedTo) {
          if (skippedLine) {
            potentialLines.push(skippedLine);
            skippedLine = undefined;
            skips = 0;
          }
          potentialLines.push(lineItems);
          numbers.push(number);
        } else {
          if (potentialLines.length > 0) {
            if (skips < config.maxSkips) {
              skips++;
              skippedLine = lineItems;
            } else {
              memorizeLineItemsIfValid(tocLineUuids, potentialLines, numbers);
              potentialLines = [];
              //   numbers=[];
              skips = 0;
              skippedLine = undefined;
            }
          }
        }
      });
      memorizeLineItemsIfValid(tocLineUuids, potentialLines, numbers);
    });

    return {
      items: inputItems.map((item) =>
        tocLineUuids.has(item.uuid) ? item.withDataAddition({ type: ElementType.TOC }) : item,
      ),
      messages: [],
    };
  }
}

function memorizeLineItemsIfValid(memorizedUuids: Set<string>, potentialLines: Item[][], numbers: number[]) {
  if (potentialLines.length < 3) {
    return;
  }
  const numbersAreAscending = numbers.every((num, idx) => (idx > 0 ? num >= numbers[idx - 1] : num > 0));
  if (!numbersAreAscending) {
    return;
  }
  potentialLines.forEach((lineItems) => lineItems.forEach((item) => memorizedUuids.add(item.uuid)));
}

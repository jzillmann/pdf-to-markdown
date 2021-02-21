import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import { transformGroupedByPage } from '../support/itemUtils';

export default class CompactLines extends ItemTransformer {
  constructor() {
    super(
      'Compact Lines',
      'Combines items on the same y-axis',
      {
        requireColumns: ['str', 'y'],
        itemMerger: {
          groupKey: 'line',
          merge: mergeLineItems,
        },
      },
      (incomingSchema) => {
        return incomingSchema.reduce((schema, column) => {
          if (column === 'x') {
            return [...schema, 'line', 'x'];
          }
          return [...schema, column];
        }, new Array<string>());
      },
    );
  }

  transform(_: TransformContext, inputItems: Item[]): ItemResult {
    return {
      items: transformGroupedByPage(inputItems, (page, items) => {
        let lineNumber = -1;
        let lastY: number | undefined;
        return items.map((item) => {
          const y = item.data['y'];
          if (!lastY || y < lastY) {
            lineNumber++;
          }
          lastY = y;
          return item.withDataAddition({ line: lineNumber });
        });
      }),
      messages: [],
    };
  }
}

function mergeLineItems(items: Item[]): Item {
  const page = items[0].page;
  const line = items[0].data['line'];
  const str = items.map((item) => item.data['str']).join(' ');
  const x = Math.min(...items.map((item) => item.data['x']));
  const y = Math.min(...items.map((item) => item.data['y']));
  const width = items.reduce((sum, item) => sum + item.data['width'], 0);
  const height = Math.max(...items.map((item) => item.data['height']));
  const fontNames = [...new Set(items.map((item) => item.data['fontName']))];
  const directions = [...new Set(items.map((item) => item.data['dir']))];
  return new Item(page, {
    str,
    line,
    x,
    y,
    width,
    height,
    fontName: fontNames,
    dir: directions,
  });
}

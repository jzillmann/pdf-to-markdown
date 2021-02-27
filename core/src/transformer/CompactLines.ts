import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import { transformGroupedByPage } from '../support/itemUtils';
import LineItemMerger from '../support/LineItemMerger';

export default class CompactLines extends ItemTransformer {
  constructor() {
    super(
      'Compact Lines',
      'Combines items on the same y-axis',
      {
        requireColumns: ['str', 'y', 'height'],
        debug: {
          itemMerger: new LineItemMerger(),
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
    let lines = 0;
    return {
      items: transformGroupedByPage(inputItems, (page, items) => {
        let lineNumber = -1;
        let lastY: number | undefined;
        return items.map((item) => {
          const y = item.data['y'];
          const height = item.data['height'];
          if (!lastY || Math.abs(Math.round(lastY - y)) > Math.round(height)) {
            lineNumber++;
            lines++;
          }
          lastY = y;
          return item.withDataAddition({ line: lineNumber });
        });
      }),
      messages: [`Formed ${lines} lines out of ${inputItems.length} items`],
    };
  }
}

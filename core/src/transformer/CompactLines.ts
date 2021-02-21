import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import { transformGroupedByPage } from './transformerUtils';

export default class CompactLines extends ItemTransformer {
  constructor() {
    super(
      'Compact Lines',
      'Combines items on the same y-axis',
      {
        requireColumns: ['str', 'y'],
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

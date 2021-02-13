import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';

export default class CalculateCoordinates extends ItemTransformer {
  constructor() {
    super(
      'Calculate Coordinates',
      'Extracts X and Y out of the Transform array',
      {
        requireColumns: ['transform'],
      },
      (incomingSchema) => {
        return incomingSchema.reduce((schema, column) => {
          if (column === 'transform') {
            return [...schema, 'x', 'y'];
          }
          return [...schema, column];
        }, new Array<string>());
      },
    );
  }

  transform(_: TransformContext, items: Item[]): ItemResult {
    const transformedItems = items.map((item) => {
      const transform: number[] = item.data['transform'];
      const x = transform[4];
      const y = transform[5];
      return item.withDataAddition({ x, y });
    });
    return { items: transformedItems, messages: [] };
  }
}

import Item from '../Item';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';

export default class CalculateCoordinates extends ItemTransformer {
  constructor() {
    super('Calculate Coordinates', {
      consumes: ['transform'],
      produces: ['X', 'Y'],
      removes: ['transform'],
    });
  }

  transform(context: TransformContext, items: Item[]): Item[] {
    // const transform: number[] = item.value['Transform'];
    items.shift();
    return items;
  }
}

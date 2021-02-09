import Item from '../Item';
import ItemResult from '../ItemResult';
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

  transform(context: TransformContext, items: Item[]): ItemResult {
    // const transform: number[] = item.value['Transform'];
    items.shift();
    if(items[0]){
      items[0].data['fontName']='xxx';
    }
    return { items, messages: [] };
  }
}

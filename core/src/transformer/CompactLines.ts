import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';

export default class CompactLines extends ItemTransformer {
  constructor() {
    super('Compact Lines', 'Combines items on the same y-axis', {
      requireColumns: ['str', 'y'],
    });
  }

  transform(_: TransformContext, items: Item[]): ItemResult {
    return { items: items, messages: [] };
  }
}

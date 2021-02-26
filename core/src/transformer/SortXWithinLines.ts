import Item from '../Item';
import ItemResult from '../ItemResult';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';
import { transformGroupedByPageAndLine } from '../support/itemUtils';

export default class SortXWithinLines extends ItemTransformer {
  constructor() {
    super('Sort by X', 'Sorts the items of a line by the x coordinate', {
      requireColumns: ['line', 'x'],
      // itemMerger: {
      //   groupKey: 'line',
      //   merge: mergeLineItems,
      // },
    });
  }

  transform(_: TransformContext, inputItems: Item[]): ItemResult {
    return {
      items: transformGroupedByPageAndLine(inputItems, (_, __, items) => {
        return items.sort((a, b) => a.data['x'] - b.data['x']);
      }),
      messages: [],
    };
  }
}

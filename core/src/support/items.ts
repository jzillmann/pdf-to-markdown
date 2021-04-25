import Item from '../Item';
import ItemType from '../ItemType';

export function itemWithType(item: Item, type: ItemType): Item {
  const existingTypes = item.data['types'] || [];
  return item.withDataAddition({ types: [...existingTypes, type] });
}

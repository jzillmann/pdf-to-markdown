import type Item from './Item';

export default interface ItemMerger {
  groupKey: string;
  merge(items: Item[]): Item;
}

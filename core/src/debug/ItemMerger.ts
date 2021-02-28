import type ChangeTracker from './ChangeTracker';
import type Item from '../Item';

/**
 * Groups individual items and merges them to a kind of top level summary item.
 */
export default abstract class ItemMerger {
  constructor(public groupKey: string) {}
  abstract merge(tracker: ChangeTracker, items: Item[]): Item;
}

import ChangeTracker from './ChangeTracker';
import { assertDefined } from '../assert';
import Item from '../Item';

/**
 * Compares incomming and outgoing items of a transformer in order to detect changes and to display them in any debug visualization.
 */
export function detectChanges(tracker: ChangeTracker, inputItems: Item[], transformedItems: Item[]) {
  const inputItemsByUuid = inputMap(inputItems);
  transformedItems.forEach((item, idx) => {
    const uuid = _uuid(item);
    const oldItem = inputItemsByUuid.get(uuid);
    if (oldItem) {
      if (idx !== oldItem.position) {
        tracker.trackPositionalChange(item, oldItem.position, idx);
      }
      //TODO check for change
    } else {
      tracker.trackAddition(item);
    }
  });

  //TODO detect removals (need to re-add them ?)
}

interface InputItem {
  item: Item;
  position: number;
}

function inputMap(inputItems: Item[]): Map<string, InputItem> {
  return inputItems.reduce((map, item, idx) => {
    map.set(_uuid(item), { item, position: idx });
    return map;
  }, new Map());
}

function _uuid(item: Item): string {
  return assertDefined(item.uuid, 'UUID is not set');
}

import { assertDefined } from '../assert';
import Item from '../Item';

// export enum ChangeType {
//   POSITION_CHANGED = 'POSITION_CHANGED',
//   ADDED = 'ADDED',
//   REMOVED = 'REMOVED',
//   CHANGED = 'CHANGED',
//   EVALUATED = 'EVALUATED',
// }

// Marker interface for a change
export abstract class Change {
  constructor(public category: ChangeCategory) {}
}

// This is merely for coloring different kind of changes
export enum ChangeCategory {
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  NEUTRAL = 'NEUTRAL',
}

export class Addition extends Change {
  constructor() {
    super(ChangeCategory.PLUS);
  }
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
}

export class PositionChange extends Change {
  constructor(public direction: Direction, public amount: number) {
    super(direction === Direction.UP ? ChangeCategory.PLUS : ChangeCategory.NEUTRAL);
  }
}

/**
 * Compares incomming and outgoing items of a transformer in order to detect changes and to display them in any debug visualization.
 */
export function detectChanges(inputItems: Item[], transformedItems: Item[]): Map<string, Change> {
  const changes: Map<string, Change> = new Map();
  const inputItemsByUuid = inputMap(inputItems);
  transformedItems.forEach((item, idx) => {
    const uuid = getUuid(item);
    const oldItem = inputItemsByUuid.get(uuid);
    if (oldItem) {
      if (idx !== oldItem.position) {
        const direction = idx > oldItem.position ? Direction.DOWN : Direction.UP;
        const amount = Math.abs(idx - oldItem.position);
        changes.set(uuid, new PositionChange(direction, amount));
      }
      //TODO check for change
    } else {
      changes.set(uuid, new Addition());
    }
  });

  //TODO detect removals (need to re-add them ?)

  return changes;
}

interface InputItem {
  item: Item;
  position: number;
}

function inputMap(inputItems: Item[]): Map<string, InputItem> {
  return inputItems.reduce((map, item, idx) => {
    map.set(getUuid(item), { item, position: idx });
    return map;
  }, new Map());
}

function getUuid(item: Item): string {
  return assertDefined(item.uuid, 'UUID is not set');
}

import ChangeIndex, {
  Change,
  ChangeCategory,
  Addition,
  Removal,
  PositionChange,
  ContentChange,
  Direction,
} from './ChangeIndex';
import Item from '../Item';
import { assertNot, assertDefined } from '../assert';

const ADDITION = new Addition();
const REMOVAL = new Removal();
const CONTENT_CHANGE = new ContentChange();

export default class ChangeTracker implements ChangeIndex {
  private changes: Map<string, Change> = new Map();

  private addChange(item: Item, change: Change) {
    const uuid = _uuid(item);
    assertNot(this.changes.has(uuid), `Change for item ${uuid} already defined`);
    this.changes.set(uuid, change);
  }

  changeCount(): number {
    return this.changes.size;
  }

  trackAddition(item: Item) {
    this.addChange(item, ADDITION);
  }

  trackRemoval(item: Item) {
    this.addChange(item, REMOVAL);
  }

  trackPositionalChange(item: Item, oldPosition: number, newPosition: number) {
    const direction = newPosition > oldPosition ? Direction.DOWN : Direction.UP;
    const amount = Math.abs(newPosition - oldPosition);
    this.addChange(item, new PositionChange(direction, amount));
  }

  trackContentChange(item: Item) {
    this.addChange(item, CONTENT_CHANGE);
  }

  change(item: Item): Change | undefined {
    return this.changes.get(_uuid(item));
  }

  hasChanged(item: Item): boolean {
    return this.changes.has(_uuid(item));
  }

  isPlusChange(item: Item): boolean {
    return this.change(item)?.category === ChangeCategory.PLUS;
  }

  isNeutralChange(item: Item): boolean {
    return this.change(item)?.category === ChangeCategory.NEUTRAL;
  }

  isMinusChange(item: Item): boolean {
    return this.change(item)?.category === ChangeCategory.MINUS;
  }
}

function _uuid(item: Item): string {
  return assertDefined(item.uuid, 'UUID is not set');
}
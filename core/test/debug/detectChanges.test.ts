import ChangeTracker from 'src/debug/ChangeTracker';
import { detectChanges } from 'src/debug/detectChanges';
import { PositionChange, Direction } from 'src/debug/ChangeIndex';
import { items } from 'test/testItems';

test('No changes', async () => {
  const inputItems = items(0, [
    { id: 'A', line: '1', x: 1 },
    { id: 'D', line: '1', x: 4 },
    { id: 'C', line: '1', x: 3 },
    { id: 'B', line: '1', x: 2 },
  ]);

  const tracker = new ChangeTracker();
  detectChanges(tracker, inputItems, inputItems);
  expect(tracker.changeCount()).toEqual(0);
});
test('Positional changes', async () => {
  const inputItems = items(0, [
    { id: 'A', line: '1', x: 1 },
    { id: 'D', line: '1', x: 4 },
    { id: 'C', line: '1', x: 3 },
    { id: 'B', line: '1', x: 2 },
  ]);

  const transformedItems = [inputItems[0], inputItems[3], inputItems[2], inputItems[1]];

  const tracker = new ChangeTracker();
  const changes = detectChanges(tracker, inputItems, transformedItems);
  expect(tracker.changeCount()).toEqual(2);
  expect(tracker.change(inputItems[1])).toEqual(new PositionChange(Direction.DOWN, 2));
  expect(tracker.change(inputItems[3])).toEqual(new PositionChange(Direction.UP, 2));
});

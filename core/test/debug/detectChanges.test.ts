import { detectChanges, PositionChange, Direction } from 'src/debug/detectChanges';
import { items } from 'test/testItems';

test('No changes', async () => {
  const inputItems = items(0, [
    { id: 'A', line: '1', x: 1 },
    { id: 'D', line: '1', x: 4 },
    { id: 'C', line: '1', x: 3 },
    { id: 'B', line: '1', x: 2 },
  ]);

  const changes = detectChanges(inputItems, inputItems);
  expect(changes).toEqual(new Map());
});
test('Positional changes', async () => {
  const inputItems = items(0, [
    { id: 'A', line: '1', x: 1 },
    { id: 'D', line: '1', x: 4 },
    { id: 'C', line: '1', x: 3 },
    { id: 'B', line: '1', x: 2 },
  ]);

  const transformedItems = [inputItems[0], inputItems[3], inputItems[2], inputItems[1]];

  const changes = detectChanges(inputItems, transformedItems);
  expect(changes).toEqual(
    new Map([
      [inputItems[1].uuid, new PositionChange(Direction.DOWN, 2)],
      [inputItems[3].uuid, new PositionChange(Direction.UP, 2)],
    ]),
  );
});

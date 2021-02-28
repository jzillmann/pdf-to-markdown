import LineItemMerger from 'src/debug/LineItemMerger';
import ChangeTracker from 'src/debug/ChangeTracker';
import Item from 'src/Item';
import { items, realisticItems } from '../testItems';
import { Addition, ContentChange } from 'src/debug/ChangeIndex';

test('Basics', async () => {
  const itemMerger = new LineItemMerger();
  const tracker = new ChangeTracker();
  expect(itemMerger.groupKey).toEqual('line');
  const mergedItem = itemMerger.merge(
    tracker,
    items(0, [
      {
        line: 2,
        x: 240,
        y: 585,
        str: 'Dies ist eine Test-PDF',
        fontName: 'g_d0_f2',
        dir: 'ltr',
        width: 108.62,
        height: 11,
      },
      {
        line: 2,
        x: 352.69,
        y: 585,
        str: '.',
        fontName: 'g_d0_f2',
        dir: 'ltr',
        width: 3.06,
        height: 11,
      },
      {
        line: 2,
        x: 348,
        y: 588,
        str: '1',
        fontName: 'g_d0_f2',
        dir: 'ltr',
        width: 4.08,
        height: 7.33,
      },
    ]),
  );
  expect(mergedItem.withoutUuid()).toEqual(
    new Item(0, {
      line: 2,
      x: 240,
      y: 585,
      str: 'Dies ist eine Test-PDF . 1',
      fontName: ['g_d0_f2'],
      dir: ['ltr'],
      width: 115.76,
      height: 11,
    }).withoutUuid(),
  );
});

test('Track all lines as changes', async () => {
  const itemMerger = new LineItemMerger(true);
  const tracker = new ChangeTracker();
  const mergedItem = itemMerger.merge(tracker, realisticItems(0, [{ line: 1 }, { line: 1 }]));
  expect(tracker.change(mergedItem)).toEqual(new Addition());
});

test('Mark lines containing changed items as changed', async () => {
  const itemMerger = new LineItemMerger();
  const tracker = new ChangeTracker();
  const items1 = realisticItems(0, [{ line: 1 }, { line: 1 }]);
  const items2 = realisticItems(0, [{ line: 2 }, { line: 2 }]);
  tracker.trackPositionalChange(items1[1], 1, 0);
  const mergedItem1 = itemMerger.merge(tracker, items1);
  const mergedItem2 = itemMerger.merge(tracker, items2);
  expect(tracker.change(mergedItem1)).toEqual(new ContentChange());
  expect(tracker.change(mergedItem2)).toEqual(undefined);
});

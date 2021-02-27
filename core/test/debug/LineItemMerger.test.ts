import LineItemMerger from 'src/debug/LineItemMerger';
import Item from 'src/Item';
import { items } from '../testItems';

const itemMerger = new LineItemMerger();

test('Basics', async () => {
  expect(itemMerger.groupKey).toEqual('line');

  const mergedItem = itemMerger?.merge(
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
  expect(mergedItem?.withoutUuid()).toEqual(
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

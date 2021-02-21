import Item from 'src/Item';
import { transformGroupedByPage } from 'src/transformer/transformerUtils';

describe('transformGroupedByPage', () => {
  test('empty', async () => {
    const transformedItems = transformGroupedByPage([], () => fail("shoudln't be called"));
    expect(transformedItems).toEqual([]);
  });

  test('pipe through', async () => {
    const pageItems = [
      [new Item(0, { id: 1 })],
      [new Item(1, { id: 2 }), new Item(1, { id: 3 })],
      [new Item(2, { id: 4 })],
    ];
    const flattenedItems = new Array<Item>().concat(...pageItems);
    const transformedItems = transformGroupedByPage(flattenedItems, (page, items) => {
      expect(items).toEqual(pageItems[page]);
      return items;
    });
    expect(transformedItems).toEqual(flattenedItems);
  });

  test('change', async () => {
    const input = [new Item(0, { v: 0 }), new Item(1, { v: 0 })];
    const transformedItems = transformGroupedByPage(input, (_, items) => {
      return [items[0].withData({ v: 1 })];
    });
    expect(transformedItems).toEqual(input.map((item) => item.withData({ v: 1 })));
  });
});

import Item from 'src/Item';
import {
  groupByPage,
  groupByElement,
  transformGroupedByPage,
  transformGroupedByPageAndLine,
} from 'src/support/groupingUtils';
import { items } from 'test/testItems';

describe('groupByPage', () => {
  test('empty', async () => {
    expect(groupByPage([])).toEqual([]);
  });

  test('group', async () => {
    const pageItems = [
      [new Item(0, { id: 1 })],
      [new Item(1, { id: 2 }), new Item(1, { id: 3 })],
      [new Item(2, { id: 4 })],
    ];
    const flattenedItems = new Array<Item>().concat(...pageItems);
    const transformedItems = groupByPage(flattenedItems);
    expect(transformedItems).toEqual(pageItems);
  });
});

describe('groupByElement', () => {
  test('empty', async () => {
    expect(groupByElement([], 'line')).toEqual([]);
  });

  test('group', async () => {
    const groupedItems = [
      [new Item(0, { line: 1, id: 1 })],
      [new Item(0, { line: 2, id: 2 }), new Item(0, { line: 2, id: 3 })],
      [new Item(0, { line: 3, id: 4 })],
    ];
    const flattenedItems = new Array<Item>().concat(...groupedItems);
    const transformedItems = groupByElement(flattenedItems, 'line');
    expect(transformedItems).toEqual(groupedItems);
  });
});

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

describe('transformGroupedByPageAndLine', () => {
  test('empty', async () => {
    const transformedItems = transformGroupedByPageAndLine([], () => fail("shoudln't be called"));
    expect(transformedItems).toEqual([]);
  });

  test('transform', async () => {
    const pageItems = [
      items(0, [{ line: 1, id: 1 }]),
      items(1, [
        { line: 1, id: 2 },
        { line: 1, id: 3 },
        { line: 2, id: 4 },
      ]),
      items(2, [{ line: 1, id: 5 }]),
    ];
    const flattenedItems = new Array<Item>().concat(...pageItems);
    const transformedItems = transformGroupedByPageAndLine(flattenedItems, (page, line, items) => {
      return [new Item(0, { group: `${page}/${line}:${items.length}` })];
    });
    expect(transformedItems.map((item) => item.data['group'])).toEqual(['0/1:1', '1/1:2', '1/2:1', '2/1:1']);
  });
});

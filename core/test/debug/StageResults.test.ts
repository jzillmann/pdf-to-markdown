import StageResult from 'src/debug/StageResult';
import { toDescriptor } from 'src/TransformDescriptor';
import ChangeTracker from 'src/debug/ChangeTracker';
import AnnotatedColumn from 'src/debug/AnnotatedColumn';
import Page, { asPages } from 'src/debug/Page';
import { items } from '../testItems';
import LineItemMerger from 'src/debug/LineItemMerger';
import ItemGroup from 'src/debug/ItemGroup';

test('itemsUnpacked', async () => {
  const tracker = new ChangeTracker();
  const itemMerger = new LineItemMerger(false);
  const descriptor = toDescriptor({ debug: { itemMerger } });
  const schema: AnnotatedColumn[] = [{ name: 'A' }];
  const flatItems = [
    ...items(0, [
      { idx: 0, line: 1 },
      { idx: 1, line: 1 },
      { idx: 2, line: 2 },
    ]),
    ...items(1, [{ idx: 3, line: 1 }]),
    ...items(2, [
      { idx: 4, line: 1 },
      { idx: 5, line: 1 },
    ]),
  ];
  const pages = asPages(tracker, flatItems, itemMerger);
  const result = new StageResult(descriptor, schema, pages, tracker, []);

  expect(result.itemsUnpacked().map((item) => item.data['idx'])).toEqual([0, 1, 2, 3, 4, 5]);
});

describe('select pages', () => {
  function groupElements(page: Page, elementName: string) {
    return page.itemGroups.map((group) => group.unpacked().map((item) => item.data['idx']));
  }
  test('Changes on group level', async () => {
    const tracker = new ChangeTracker();
    const itemMerger = new LineItemMerger(true);
    const descriptor = toDescriptor({ debug: { itemMerger } });
    const schema: AnnotatedColumn[] = [{ name: 'A' }];
    const flatItems = [
      ...items(0, [
        { idx: 0, line: 1 },
        { idx: 1, line: 1 },
        { idx: 2, line: 2 },
      ]),
      ...items(1, [{ idx: 3, line: 1 }]),
      ...items(2, [
        { idx: 4, line: 1 },
        { idx: 5, line: 1 },
      ]),
    ];
    const pages = asPages(tracker, flatItems, itemMerger);
    const result = new StageResult(descriptor, schema, pages, tracker, []);

    const allGrouped = result.selectPages(false, true);
    expect(allGrouped.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(allGrouped[0], 'idx')).toEqual([[0, 1], [2]]);
    expect(groupElements(allGrouped[1], 'idx')).toEqual([[3]]);
    expect(groupElements(allGrouped[2], 'idx')).toEqual([[4, 5]]);

    const relevantGrouped = result.selectPages(true, true);
    expect(relevantGrouped.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(relevantGrouped[0], 'idx')).toEqual([[0, 1]]);
    expect(groupElements(relevantGrouped[1], 'idx')).toEqual([]);
    expect(groupElements(relevantGrouped[2], 'idx')).toEqual([[4, 5]]);

    const relevantUnpacked = result.selectPages(true, false);
    expect(relevantUnpacked.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(relevantUnpacked[0], 'idx')).toEqual([]);
    expect(groupElements(relevantUnpacked[1], 'idx')).toEqual([]);
    expect(groupElements(relevantUnpacked[2], 'idx')).toEqual([]);

    const allUnpacked = result.selectPages(false, false);
    expect(allUnpacked.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(allUnpacked[0], 'idx')).toEqual([[0], [1], [2]]);
    expect(groupElements(allUnpacked[1], 'idx')).toEqual([[3]]);
    expect(groupElements(allUnpacked[2], 'idx')).toEqual([[4], [5]]);

    const allGroupedWithPin = result.selectPages(false, true, 0);
    expect(allGroupedWithPin.map((page) => page.index)).toEqual([0]);
    expect(groupElements(allGroupedWithPin[0], 'idx')).toEqual([[0, 1], [2]]);

    const relevantGroupedWithPin = result.selectPages(true, true, 0);
    expect(relevantGroupedWithPin.map((page) => page.index)).toEqual([0]);
    expect(groupElements(relevantGroupedWithPin[0], 'idx')).toEqual([[0, 1]]);

    const relevantUnpackedWithPin = result.selectPages(true, false, 0);
    expect(relevantUnpackedWithPin.map((page) => page.index)).toEqual([0]);
    expect(groupElements(relevantUnpackedWithPin[0], 'idx')).toEqual([]);

    const allUnpackedWithPin = result.selectPages(false, false, 0);
    expect(allUnpackedWithPin.map((page) => page.index)).toEqual([0]);
    expect(groupElements(allUnpackedWithPin[0], 'idx')).toEqual([[0], [1], [2]]);
  });

  test('Changes on element level', async () => {
    const tracker = new ChangeTracker();
    const itemMerger = new LineItemMerger(false);
    const descriptor = toDescriptor({ debug: { itemMerger } });
    const schema: AnnotatedColumn[] = [{ name: 'A' }];
    const flatItems = [
      ...items(0, [
        { idx: 0, line: 1 },
        { idx: 1, line: 1 },
        { idx: 2, line: 2 },
      ]),
      ...items(1, [{ idx: 3, line: 1 }]),
      ...items(2, [
        { idx: 4, line: 1 },
        { idx: 5, line: 1 },
        { idx: 6, line: 2 },
      ]),
    ];
    tracker.trackAddition(flatItems[3]);
    tracker.trackAddition(flatItems[5]);
    const pages = asPages(tracker, flatItems, itemMerger);
    const result = new StageResult(descriptor, schema, pages, tracker, []);

    const allGrouped = result.selectPages(false, true);
    expect(allGrouped.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(allGrouped[0], 'idx')).toEqual([[0, 1], [2]]);
    expect(groupElements(allGrouped[1], 'idx')).toEqual([[3]]);
    expect(groupElements(allGrouped[2], 'idx')).toEqual([[4, 5], [6]]);

    const relevantGrouped = result.selectPages(true, true);
    expect(relevantGrouped.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(relevantGrouped[0], 'idx')).toEqual([]);
    expect(groupElements(relevantGrouped[1], 'idx')).toEqual([[3]]);
    expect(groupElements(relevantGrouped[2], 'idx')).toEqual([[4, 5]]);

    const relevantUnpacked = result.selectPages(true, false);
    expect(relevantUnpacked.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(relevantUnpacked[0], 'idx')).toEqual([]);
    expect(groupElements(relevantUnpacked[1], 'idx')).toEqual([[3]]);
    expect(groupElements(relevantUnpacked[2], 'idx')).toEqual([[5]]);

    const allUnpacked = result.selectPages(false, false);
    expect(allUnpacked.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(allUnpacked[0], 'idx')).toEqual([[0], [1], [2]]);
    expect(groupElements(allUnpacked[1], 'idx')).toEqual([[3]]);
    expect(groupElements(allUnpacked[2], 'idx')).toEqual([[4], [5], [6]]);

    const allGroupedWithPin = result.selectPages(false, true, 2);
    expect(allGroupedWithPin.map((page) => page.index)).toEqual([2]);
    expect(groupElements(allGroupedWithPin[0], 'idx')).toEqual([[4, 5], [6]]);

    const relevantGroupedWithPin = result.selectPages(true, true, 2);
    expect(relevantGroupedWithPin.map((page) => page.index)).toEqual([2]);
    expect(groupElements(relevantGroupedWithPin[0], 'idx')).toEqual([[4, 5]]);

    const relevantUnpackedWithPin = result.selectPages(true, false, 2);
    expect(relevantUnpackedWithPin.map((page) => page.index)).toEqual([2]);
    expect(groupElements(relevantUnpackedWithPin[0], 'idx')).toEqual([[5]]);

    const allUnpackedWithPin = result.selectPages(false, false, 2);
    expect(allUnpackedWithPin.map((page) => page.index)).toEqual([2]);
    expect(groupElements(allUnpackedWithPin[0], 'idx')).toEqual([[4], [5], [6]]);
  });

  test('showAll - grouped', async () => {
    const tracker = new ChangeTracker();
    const itemMerger = new LineItemMerger(false);
    const descriptor = toDescriptor({ debug: { itemMerger, showAll: true } });
    const schema: AnnotatedColumn[] = [{ name: 'A' }];
    const flatItems = [
      ...items(0, [
        { idx: 0, line: 1 },
        { idx: 1, line: 1 },
        { idx: 2, line: 2 },
      ]),
      ...items(1, [{ idx: 3, line: 1 }]),
      ...items(2, [
        { idx: 4, line: 1 },
        { idx: 5, line: 1 },
      ]),
    ];
    const pages = asPages(tracker, flatItems, itemMerger);
    const result = new StageResult(descriptor, schema, pages, tracker, []);

    const relevantGrouped = result.selectPages(true, true);
    expect(relevantGrouped.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(relevantGrouped[0], 'idx')).toEqual([[0, 1], [2]]);
    expect(groupElements(relevantGrouped[1], 'idx')).toEqual([[3]]);
    expect(groupElements(relevantGrouped[2], 'idx')).toEqual([[4, 5]]);
  });

  test('showAll - grouped', async () => {
    const tracker = new ChangeTracker();
    const descriptor = toDescriptor({ debug: { showAll: true } });
    const schema: AnnotatedColumn[] = [{ name: 'A' }];
    const flatItems = [
      ...items(0, [{ idx: 0 }, { idx: 1 }, { idx: 2 }]),
      ...items(1, [{ idx: 3 }]),
      ...items(2, [{ idx: 4 }, { idx: 5 }]),
    ];
    const pages = asPages(tracker, flatItems);
    const result = new StageResult(descriptor, schema, pages, tracker, []);

    const relevantGrouped = result.selectPages(true, true);
    expect(relevantGrouped.map((page) => page.index)).toEqual([0, 1, 2]);
    expect(groupElements(relevantGrouped[0], 'idx')).toEqual([[0], [1], [2]]);
    expect(groupElements(relevantGrouped[1], 'idx')).toEqual([[3]]);
    expect(groupElements(relevantGrouped[2], 'idx')).toEqual([[4], [5]]);
  });
});

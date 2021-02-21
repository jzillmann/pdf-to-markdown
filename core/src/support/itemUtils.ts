import ItemMerger from 'src/ItemMerger';
import Item from '../Item';
import ItemGroup from './ItemGroup';
import Page from './Page';

type PageItemTransformer = (page: number, items: Item[]) => Item[];

export function groupByPage(items: Item[]): Item[][] {
  return items.reduce((pageItems: Item[][], item: Item) => {
    const lastPageItems = pageItems[pageItems.length - 1];
    if (!lastPageItems || item.page > lastPageItems[0]?.page) {
      pageItems.push([item]);
    } else {
      lastPageItems.push(item);
    }
    return pageItems;
  }, []);
}

export function groupByElement(items: Item[], elementName: string): Item[][] {
  return items.reduce((groupedItems: Item[][], item: Item) => {
    const lastGroupItems = groupedItems[groupedItems.length - 1];
    if (!lastGroupItems || item.data[elementName] !== lastGroupItems[0]?.data[elementName]) {
      groupedItems.push([item]);
    } else {
      lastGroupItems.push(item);
    }
    return groupedItems;
  }, []);
}

export function transformGroupedByPage(items: Item[], groupedTransformer: PageItemTransformer): Item[] {
  return new Array<Item>().concat(
    ...groupByPage(items).map((pageItems) => groupedTransformer(pageItems[0].page, pageItems)),
  );
}

export function asPages(items: Item[], itemMerger?: ItemMerger): Page[] {
  return groupByPage(items).map((pageItems: Item[]) => {
    let itemGroups: ItemGroup[];
    if (itemMerger) {
      itemGroups = groupByElement(pageItems, itemMerger.groupKey).map((groupItems) => {
        if (groupItems.length > 1) {
          const top = itemMerger.merge(groupItems);
          return new ItemGroup(top, groupItems);
        } else {
          return new ItemGroup(groupItems[0]);
        }
      });
    } else {
      itemGroups = pageItems.map((item) => new ItemGroup(item));
    }
    return { index: pageItems[0].page, itemGroups } as Page;
  });
}

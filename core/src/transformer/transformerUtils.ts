import Item from '../Item';

type PageItemTransformer = (page: number, items: Item[]) => Item[];

export function transformGroupedByPage(items: Item[], groupedTransformer: PageItemTransformer) {
  return new Array<Item>().concat(
    ...items
      .reduce((pageItems: Item[][], item: Item) => {
        const lastPageItems = pageItems[pageItems.length - 1];
        if (!lastPageItems || item.page > lastPageItems[0]?.page) {
          pageItems.push([item]);
        } else {
          lastPageItems.push(item);
        }
        return pageItems;
      }, [])
      .map((pageItems) => groupedTransformer(pageItems[0].page, pageItems)),
  );
}

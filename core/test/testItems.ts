import Item from 'src/Item';

export function items(page: number, data: object[]): Item[] {
  return data.map((data) => new Item(page, data));
}

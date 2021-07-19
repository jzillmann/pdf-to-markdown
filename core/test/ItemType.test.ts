import ItemType from 'src/ItemType';

test('headers', async () => {
  expect(ItemType.header(1)).toEqual(ItemType.H1);
  expect(ItemType.header(2)).toEqual(ItemType.H2);
  expect(ItemType.header(3)).toEqual(ItemType.H3);
  expect(ItemType.header(4)).toEqual(ItemType.H4);
  expect(ItemType.header(5)).toEqual(ItemType.H5);
  expect(ItemType.header(6)).toEqual(ItemType.H6);

  expect(() => ItemType.header(0)).toThrow("No header for level '0' defined");
  expect(() => ItemType.header(7)).toThrow("No header for level '7' defined");
});

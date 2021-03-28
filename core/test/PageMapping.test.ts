import PageMapping from 'src/PageMapping';

test('1-to-1', async () => {
  const mapping = new PageMapping(0, false);
  expect(mapping.pageFactor).toEqual(0);
  expect([...Array(3).keys()].map((i) => mapping.pageLabel(i))).toEqual(['1', '2', '3']);
});

test('lame start', async () => {
  const mapping = new PageMapping(-3, true);
  expect([...Array(5).keys()].map((i) => mapping.pageLabel(i))).toEqual(['I', 'II', 'III', '1', '2']);
});

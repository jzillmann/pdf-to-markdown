import { filterOutDigits, extractNumbers, extractEndingNumber } from 'src/support/stringFunctions';

test('filterOutDigits', async () => {
  expect(filterOutDigits('')).toEqual('');
  expect(filterOutDigits('a b c')).toEqual('a b c');
  expect(filterOutDigits('a1b 2c 3')).toEqual('ab c ');
});

test('extractNumbers', async () => {
  expect(extractNumbers('')).toEqual([]);
  expect(extractNumbers('a b c')).toEqual([]);
  expect(extractNumbers('a1b 2c 3')).toEqual([1, 2, 3]);
  expect(extractNumbers('a12 21 304')).toEqual([12, 21, 304]);
});

test('extractEndingNumbers', async () => {
  expect(extractEndingNumber('')).toBeUndefined();
  expect(extractEndingNumber('a b c')).toBeUndefined();
  expect(extractEndingNumber('a1b 2c 3')).toEqual(3);
  expect(extractEndingNumber('a12 21 304')).toEqual(304);
  expect(extractEndingNumber('abc ... 304')).toEqual(304);
});

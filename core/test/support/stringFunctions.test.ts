import { filterOutDigits } from 'src/support/stringFunctions';

test('filterOutDigits', async () => {
  expect(filterOutDigits('')).toEqual('');
  expect(filterOutDigits('a b c')).toEqual('a b c');
  expect(filterOutDigits('a1b 2c 3')).toEqual('ab c ');
});

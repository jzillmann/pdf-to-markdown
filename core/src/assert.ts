export function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertDefined<T>(value: T, message: string): T {
  assert(value !== null, message);
  assert(typeof value !== 'undefined', message);
  return value;
}

export function flatMap<T, S>(array: T[], func: (element: T, idx: number) => S[]): S[] {
  return array.reduce((result, entry, idx) => result.concat(func(entry, idx)), [] as S[]);
}

export function groupBy<T>(array: T[], groupKey: (element: T) => any): T[][] {
  const groupMap = array.reduce((map: Map<object, T[]>, element: T) => {
    const key = groupKey(element);
    const elementsInGroup = map.get(key);
    if (elementsInGroup) {
      elementsInGroup.push(element);
    } else {
      map.set(key, [element]);
    }
    return map;
  }, new Map());
  return Array.from(groupMap, ([key, value]) => value);
}

export function flatten<T>(array: T[][]): T[] {
  return flatMap(array, (e) => e);
}

export function arraysEqual(a: any[], b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

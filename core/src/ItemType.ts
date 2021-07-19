import { assertDefined } from './assert';

enum ItemType {
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
  H4 = 'H4',
  H5 = 'H5',
  H6 = 'H6',
}

export default ItemType;

namespace ItemType {
  /**
   * @param level 1-6
   * @returns
   */
  export function header(level: number): ItemType {
    const type = ItemType[`H${level}`];
    assertDefined(type, `No header for level '${level}' defined`);
    return type;
  }
}

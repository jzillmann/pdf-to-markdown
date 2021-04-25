import { FontType } from 'pdfjs-dist/types/shared/util';
import { assertDefined } from '../assert';
import Item from '../Item';
import ItemType from '../ItemType';

function get(item: Item, name: string): any {
  const value = item.data[name];
  assertDefined(value, `No '${name}' defined in ${JSON.stringify(item)}`);
  return value;
}
export function getHeight(item: Item): number {
  return get(item, 'height');
}

export function getText(item: Item): string {
  return get(item, 'str');
}

export function getFontName(fontMap: Map<string, object>, item: Item): string {
  const fontId = item.data['fontName'];
  const fontObject = fontMap.get(fontId);
  if (!fontObject) {
    return fontId;
  }
  return assertDefined(fontObject['name'], `No 'name' found in ${JSON.stringify(fontObject)}`);
}

export function itemWithType(item: Item, type: ItemType): Item {
  const existingTypes = item.data['types'] || [];
  return item.withDataAddition({ types: [...existingTypes, type] });
}

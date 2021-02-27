import ItemMerger from './ItemMerger';
import Item from '../Item';

export default class LineItemMerger extends ItemMerger {
  constructor() {
    super('line');
  }

  merge(items: Item[]): Item {
    const page = items[0].page;
    const line = items[0].data['line'];
    const str = items.map((item) => item.data['str']).join(' ');
    const x = Math.min(...items.map((item) => item.data['x']));
    const y = Math.min(...items.map((item) => item.data['y']));
    const width = items.reduce((sum, item) => sum + item.data['width'], 0);
    const height = Math.max(...items.map((item) => item.data['height']));
    const fontNames = [...new Set(items.map((item) => item.data['fontName']))];
    const directions = [...new Set(items.map((item) => item.data['dir']))];
    return new Item(page, {
      str,
      line,
      x,
      y,
      width,
      height,
      fontName: fontNames,
      dir: directions,
    });
  }
}

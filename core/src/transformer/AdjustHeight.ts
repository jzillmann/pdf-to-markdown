import PageViewport from 'src/parse/PageViewport';
import Item from '../Item';
import ItemTransformer from './ItemTransformer';
import TransformContext from './TransformContext';

export default class AdjustHeight extends ItemTransformer {
  constructor() {
    super('Adjust Heights', {
      consumes: ['transform', 'height'],
    });
  }

  transform(context: TransformContext, items: Item[]): Item[] {
    const newItems: Item[] = [];
    let page = -1;
    let pageViewport: PageViewport;
    //TODO groupBy page
    items.forEach((item) => {
      if (item.page !== page) {
        pageViewport = context.pageViewports[item.page];
        page = page;
      }
      const itemTransform = item.data['transform'];
      const itemHeight = item.data['height'];
      const tx = pageViewport.transformFunction(itemTransform);
      const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
      const dividedHeight = itemHeight / fontHeight;
      const newHeight = Number.isNaN(dividedHeight) || dividedHeight <= 1 ? itemHeight : dividedHeight;
      if (newHeight !== itemHeight) {
        newItems.push(item.withDataAddition({ height: newHeight }));
      } else {
        newItems.push(item);
      }
    });
    return items;
  }
}

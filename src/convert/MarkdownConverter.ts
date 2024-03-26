import Item from 'src/Item';
import { Converter } from 'src/convert';

export default class MarkdownConverter implements Converter {
  convert(items: Item[]) {
    let content = '';

    items.forEach((item) => {
      const types = item.data['types'] || [];
      const itemText = item.data['str'];
      if (types.includes('H1')) {
        content += '# ' + itemText + '\n';
      } else if (types.includes('H2')) {
        content += '## ' + itemText + '\n';
      } else if (types.includes('H3')) {
        content += '## ' + itemText + '\n';
      } else {
        content += itemText;
      }
      content += '\n';
    });
    return content;
  }
}

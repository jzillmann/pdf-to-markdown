import { groupByLine } from '../support/groupingUtils';
import Item from '../Item';
import { Converter } from '../convert';
import ChangeTracker from '../debug/ChangeTracker';
import EvaluationTracker from '../debug/EvaluationTracker';
import LineItemMerger from '../debug/LineItemMerger';

export default class MarkdownConverter implements Converter {
  convert(items: Item[]) {
    let content = '';

    const itemsByLine = groupByLine(items);
    const lineMerger = new LineItemMerger();
    itemsByLine.forEach((lineItems) => {
      const lineItem = lineMerger.merge(new EvaluationTracker(), new ChangeTracker(), ['types'], lineItems);
      const types = lineItem.data['types'] || [];
      const itemText = lineItem.data['str'];
      if (types.includes('H1')) {
        content += '# ' + itemText + '\n';
      } else if (types.includes('H2')) {
        content += '## ' + itemText + '\n';
      } else if (types.includes('H3')) {
        content += '### ' + itemText + '\n';
      } else if (types.includes('H4')) {
        content += '#### ' + itemText + '\n';
      } else if (types.includes('H5')) {
        content += '##### ' + itemText + '\n';
      } else if (types.includes('H6')) {
        content += '###### ' + itemText + '\n';
      } else {
        content += itemText;
      }
      content += '\n';
    });

    return content;
  }
}

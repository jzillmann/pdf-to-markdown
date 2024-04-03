import { groupByBlock, groupByLine } from '../support/groupingUtils';
import Item from '../Item';
import { Converter } from '../convert';
import ChangeTracker from '../debug/ChangeTracker';
import EvaluationTracker from '../debug/EvaluationTracker';
import LineItemMerger from '../debug/LineItemMerger';
import { TextType, headlineLevel } from '../text-types';

export default class MarkdownConverter implements Converter {
  convert(items: Item[]) {
    let content = '';

    const lineMerger = new LineItemMerger();
    groupByBlock(items).forEach((blockItems) => {
      const types = blockItems[0].data['types'] || [];
      groupByLine(blockItems).forEach((lineItems) => {
        const evaluationTracker = new EvaluationTracker();
        const changeTracker = new ChangeTracker();
        const lineItem = lineMerger.merge(evaluationTracker, changeTracker, ['types'], lineItems);
        const itemText = lineItem.data['str'];
        content += elementToText(itemText, types[0]);
      });
      content += '\n';
    });

    return content;
  }
}

function elementToText(text: string, type: TextType) {
  switch (type) {
    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
      return '#'.repeat(headlineLevel(type)) + ' ' + text + '\n';
    default:
      return text + '\n';
  }
}

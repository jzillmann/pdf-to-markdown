import PdfBlock from './BlockPage.jsx';
import TextItemCombiner from './TextItemCombiner.jsx';
import TextItem from './TextItem.jsx';

export const HEADLINE1 = "Headline 1";
export const PARAGRAPH = "Paragraph";
export const LIST_BLOCK = "List";
export const CODE_BLOCK = "Code/Quote";
export const TOC_BLOCK = "TOC";

export function blockToText(block: PdfBlock) {
    switch (block.type) {
    case CODE_BLOCK:
        return '```\n' + concatTextItems(block.textItems) + '```'
    case TOC_BLOCK:
        //TODO 2nd level
        //TODO real links
        var text = '';
        block.textItems.forEach(item => {
            text += '- ' + item.text + '\n';
        });
        return text;
    case HEADLINE1:
        return '#' + concatTextItems(block.textItems);
    default:
        var textItems = block.textItems;
        if (!block.type) {
            //TODO mostUsedDistance
            textItems = new TextItemCombiner({}).combine(textItems).textItems;
        }
        return concatTextItems(textItems);
    }
}


function concatTextItems(textItems: TextItem[]) {
    var text = '';
    textItems.forEach(item => {
        text += item.text + '\n';
    });
    return text;
}
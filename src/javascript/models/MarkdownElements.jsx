import PdfBlock from './BlockPage.jsx';

export const CODE_BLOCK = "Code/Quote";
export const HEADLINE1 = "Headline 1";

export function blockToText(block: PdfBlock) {
    const text = concatTextItems(block);
    switch (block.type) {
    case CODE_BLOCK:
        return '```\n' + text + '```'
    case HEADLINE1:
        return '#' + text;
    default:
        return text;
    }
}


function concatTextItems(block: PdfBlock) {
    var text = '';
    block.textItems.forEach(item => {
        text += item.text + '\n';
    });
    return text;
}
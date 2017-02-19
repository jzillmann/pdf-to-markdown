import PdfBlock from './BlockPage.jsx';

export const HEADLINE1 = "Headline 1";
export const CODE_BLOCK = "Code/Quote";
export const TOC_BLOCK = "TOC";

export function blockToText(block: PdfBlock) {
    switch (block.type) {
    case CODE_BLOCK:
        return '```\n' + concatTextItems(block) + '```'
    case TOC_BLOCK:
        //TODO 2nd level
        //TODO real links
        var text = '';
        block.textItems.forEach(item => {
            text += '- ' + item.text + '\n';
        });
        return text;
    case HEADLINE1:
        return '#' + concatTextItems(block);
    default:
        return concatTextItems(block);
    }
}


function concatTextItems(block: PdfBlock) {
    var text = '';
    block.textItems.forEach(item => {
        text += item.text + '\n';
    });
    return text;
}
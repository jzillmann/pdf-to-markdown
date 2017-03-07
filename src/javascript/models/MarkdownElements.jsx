import PdfBlock from './BlockPage.jsx';
import TextItemCombiner from './TextItemCombiner.jsx';
import TextItem from './TextItem.jsx';

export const HEADLINE1 = "Headline 1";
export const HEADLINE2 = "Headline 2";
export const HEADLINE3 = "Headline 3";
export const HEADLINE4 = "Headline 4";
export const HEADLINE5 = "Headline 5";
export const HEADLINE6 = "Headline 6";
export const PARAGRAPH = "Paragraph";
export const LIST_BLOCK = "List";
export const CODE_BLOCK = "Code/Quote";
export const TOC_BLOCK = "TOC";
export const FOOTNOTE_BLOCK = "Footnotes"

export function headlineByLevel(level) {
    if (level == 1) {
        return HEADLINE1;
    } else if (level == 2) {
        return HEADLINE2;
    } else if (level == 3) {
        return HEADLINE3;
    } else if (level == 4) {
        return HEADLINE4;
    } else if (level == 5) {
        return HEADLINE5;
    } else if (level == 6) {
        return HEADLINE6;
    }
    throw "Unsupported headline level: " + level;
}

export function blockToText(block: PdfBlock) {
    switch (block.type) {
    case CODE_BLOCK:
        return '```\n' + concatTextItems(block.textItems) + '```'
    case TOC_BLOCK:
        var text = '';
        //TODO real links
        //TODO de-duplicate with DetectLists ?
        block.textItems.forEach(item => {
            text += item.text + '\n';
        });
        return text;
    case HEADLINE1:
        return '# ' + concatTextItems(block.textItems);
    case HEADLINE2:
        return '## ' + concatTextItems(block.textItems);
    case HEADLINE3:
        return '### ' + concatTextItems(block.textItems);
    case HEADLINE4:
        return '#### ' + concatTextItems(block.textItems);
    case HEADLINE5:
        return '##### ' + concatTextItems(block.textItems);
    case HEADLINE6:
        return '###### ' + concatTextItems(block.textItems);
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
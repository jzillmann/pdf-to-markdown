import ToTextItemBlockTransformation from '..//ToTextItemBlockTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import { DETECTED_ANNOTATION } from '../../Annotation.jsx';
import ElementType from '../../ElementType.jsx';
import { minXFromBlocks } from '../../../textItemFunctions.jsx';

//Detect items which are code/quote blocks
export default class DetectCodeQuoteBlocks extends ToTextItemBlockTransformation {

    constructor() {
        super("Detect Code/Quote Blocks");
    }

    transform(parseResult:ParseResult) {
        const {mostUsedHeight} = parseResult.globals;
        var foundCodeItems = 0;
        parseResult.pages.forEach(page => {
            var minX = minXFromBlocks(page.items);
            page.items.forEach(block => {
                if (!block.type && looksLikeCodeBlock(minX, block.textItems, mostUsedHeight)) {
                    block.annotation = DETECTED_ANNOTATION;
                    block.type = ElementType.CODE;
                    foundCodeItems++;
                }
            });
        });

        return new ParseResult({
            ...parseResult,
            messages: [
                'Detected ' + foundCodeItems + ' code/quote items.',
            ]
        });

    }

}

function looksLikeCodeBlock(minX, textItems, mostUsedHeight) {
    if (textItems.length == 0) {
        return false;
    }
    if (textItems.length == 1) {
        return textItems[0].x > minX && textItems[0].height <= mostUsedHeight + 1;
    }
    for ( var item of textItems ) {
        if (item.x == minX) {
            return false;
        }
    }
    return true;
}

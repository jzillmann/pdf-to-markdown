import ToTextItemBlockTransformation from './ToTextItemBlockTransformation.jsx';
import Page from '../Page.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItemBlock from '../TextItemBlock.jsx';
import { minXFromTextItems } from '../../textItemFunctions.jsx';

export default class DetectPdfBlocks extends ToTextItemBlockTransformation {

    constructor() {
        super("Detect Blocks");
    }

    transform(parseResult:ParseResult) {
        const {mostUsedDistance} = parseResult.globals;
        var createdBlocks = 0;
        const newPages = parseResult.pages.map(page => {
            var minX = minXFromTextItems(page.items);
            const blocks = [];
            var textItemsInBlock = [];
            const completBlock = () => {
                if (textItemsInBlock.length > 0) { //can happen on empty page
                    blocks.push(new TextItemBlock({
                        textItems: textItemsInBlock
                    }));
                    textItemsInBlock = [];
                }
            };
            var lastItem;
            page.items.forEach(item => {

                if (lastItem) {
                    if (shouldSplit(lastItem, item, minX, mostUsedDistance)) {
                        completBlock();
                    }
                }
                textItemsInBlock.push(item);
                lastItem = item;
            });
            completBlock();

            createdBlocks += blocks.length;
            return new Page({
                ...page,
                items: blocks
            });

        });

        return new ParseResult({
            ...parseResult,
            pages: newPages,
            messages: ['Splitted into ' + createdBlocks + ' blocks']
        });
    }

}

function shouldSplit(lastItem, item, minX, mostUsedDistance) {
    const distance = lastItem.y - item.y;
    if (distance < 0 - mostUsedDistance / 2) {
        //distance is negative - and not only a bit
        return true;
    }
    var allowedDisctance = mostUsedDistance + 1;
    if (lastItem.x == item.x && item.x > minX) {
        //intended elements like lists often have greater spacing
        allowedDisctance = mostUsedDistance + mostUsedDistance / 2;
    }
    if (distance > allowedDisctance) {
        return true;
    }
    return false;
}
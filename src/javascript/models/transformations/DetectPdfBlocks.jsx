import React from 'react';
import ToPdfBlockViewTransformation from './ToPdfBlockViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import PdfBlockPage from '../PdfBlockPage.jsx';
import PdfBlock from '../PdfBlock.jsx';
import { minXFromTextItems } from '../../textItemFunctions.jsx';

export default class DetectPdfBlocks extends ToPdfBlockViewTransformation {

    constructor() {
        super("Detect Blocks");
    }

    createSummaryView(parseResult:ParseResult) {
        return <div>
                 Splitted into
                 { ' ' + parseResult.summary.createdBlocks + ' ' } blocks.
               </div>;
    }

    transform(parseResult:ParseResult) {
        const {mostUsedDistance} = parseResult.globals;
        var createdBlocks = 0;
        const newContent = parseResult.content.map(page => {
            var minX = minXFromTextItems(page.textItems);
            const blocks = [];
            var textItemsInBlock = [];
            const completBlock = () => {
                blocks.push(new PdfBlock({
                    textItems: textItemsInBlock
                }));
                textItemsInBlock = [];
            };
            var lastItem;
            page.textItems.forEach(item => {

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
            return new PdfBlockPage({
                ...page,
                blocks: blocks
            });

        });
        return new ParseResult({
            ...parseResult,
            content: newContent,
            summary: {
                createdBlocks: createdBlocks
            }
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
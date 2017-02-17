import React from 'react';
import ToPdfBlockViewTransformation from './ToPdfBlockViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import PdfBlockPage from '../PdfBlockPage.jsx';
import PdfBlock from '../PdfBlock.jsx';

export default class DetectPdfBlocks extends ToPdfBlockViewTransformation {

    constructor() {
        super("Detect Blocks");
    }

    showModificationCheckbox() {
        return false;
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
                    const distance = lastItem.y - item.y;
                    if (distance < 0 - mostUsedDistance / 2 || distance > mostUsedDistance) {
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
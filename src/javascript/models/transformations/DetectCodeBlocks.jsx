import React from 'react';
import ToPdfBlockViewTransformation from './ToPdfBlockViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import PdfBlock from '../PdfBlock.jsx';
import TextItemCombiner from '../TextItemCombiner.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../Annotation.jsx';
import { CODE_BLOCK } from '../MarkdownElements.jsx';
import { minXFromBlocks } from '../../textItemFunctions.jsx';

//Detect quotes, code etc.. which is transformed to markdown code syntax
export default class DetectCodeBlocks extends ToPdfBlockViewTransformation {

    constructor() {
        super("Detect Code/Quotes");
    }

    createSummaryView(parseResult:ParseResult) {
        return <div>
                 Detected
                 { ' ' + parseResult.summary.foundBlocks + ' ' } code/quote blocks.
               </div>;
    }

    transform(parseResult:ParseResult) {
        const {mostUsedHeight, mostUsedDistance} = parseResult.globals;

        var foundBlocks = 0;
        const textCombiner = new TextItemCombiner({});

        parseResult.content.forEach(page => {
            var minX = minXFromBlocks(page.blocks);
            if (minX) {
                const itemAreSuitable = (items) => {
                    for ( let item of items ) {
                        if (item.x == minX) {
                            return false;
                        }
                        if (item.height > mostUsedHeight + 1) {
                            return false;
                        }
                    }
                    return true;
                };
                const newBlocks = [];
                var preceedingCodeBlock;
                page.blocks.forEach(block => {
                    if (block.type) {
                        newBlocks.push(block);
                        preceedingCodeBlock = null;
                    } else {
                        if (itemAreSuitable(block.textItems)) {
                            const mergeWithPreceedingCodeBlock = preceedingCodeBlock && preceedingCodeBlock.textItems[preceedingCodeBlock.textItems.length - 1].y - block.textItems[0].y < mostUsedDistance * 2;
                            if (mergeWithPreceedingCodeBlock) {
                                newBlocks.pop();
                            }
                            block.annotation = REMOVED_ANNOTATION;
                            newBlocks.push(block);
                            if (mergeWithPreceedingCodeBlock) {
                                preceedingCodeBlock.textItems = preceedingCodeBlock.textItems.concat(textCombiner.combine(block.textItems));
                            } else {
                                preceedingCodeBlock = new PdfBlock({
                                    type: CODE_BLOCK,
                                    annotation: ADDED_ANNOTATION,
                                    textItems: textCombiner.combine(block.textItems)
                                });
                                foundBlocks++;
                            }
                            newBlocks.push(preceedingCodeBlock);
                        } else {
                            newBlocks.push(block);
                            preceedingCodeBlock = null;
                        }
                    }
                });
                page.blocks = newBlocks;
            }
        });

        return new ParseResult({
            ...parseResult,
            summary: {
                foundBlocks: foundBlocks
            }
        });

    }

}


import React from 'react';
import ToPdfBlockViewTransformation from './ToPdfBlockViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import PdfBlock from '../PdfBlock.jsx';
import TextItemCombiner from '../TextItemCombiner.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../Annotation.jsx';
import { CODE_BLOCK } from '../MarkdownElements.jsx';

//Detect quotes, code etc.. which is transformed to markdown code syntax
export default class DetectCodeBlocks extends ToPdfBlockViewTransformation {

    constructor() {
        super("Detect Code Blocks");
    }

    createSummaryView(parseResult:ParseResult) {
        return <div>
                 Detected
                 { ' ' + parseResult.summary.foundBlocks + ' ' } blocks.
               </div>;
    }

    // TODO ==> combine quotes follow each other

    transform(parseResult:ParseResult) {
        const {mostUsedHeight} = parseResult.globals;

        var foundBlocks = 0;
        const textCombiner = new TextItemCombiner({});

        parseResult.content.forEach(page => {
            var minX = 999;
            page.blocks.forEach(block => {
                block.textItems.forEach(item => {
                    minX = Math.min(minX, item.x)
                });
            });

            if (minX < 999) {
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
                page.blocks.forEach(block => {
                    if (block.type) {
                        newBlocks.push(block);
                    } else {
                        if (itemAreSuitable(block.textItems)) {
                            block.annotation = REMOVED_ANNOTATION;
                            newBlocks.push(block);
                            newBlocks.push(new PdfBlock({
                                type: CODE_BLOCK,
                                annotation: ADDED_ANNOTATION,
                                textItems: textCombiner.combine(block.textItems)
                            }));
                        } else {
                            newBlocks.push(block);
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


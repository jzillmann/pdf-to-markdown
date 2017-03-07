import ToTextItemBlockTransformation from './ToTextItemBlockTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItemBlock from '../TextItemBlock.jsx';
import TextItemCombiner from '../TextItemCombiner.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../Annotation.jsx';
import { CODE_BLOCK } from '../MarkdownElements.jsx';
import { minXFromBlocks } from '../../textItemFunctions.jsx';

//Detect quotes, code etc.. which is transformed to markdown code syntax
export default class DetectCodeBlocks extends ToTextItemBlockTransformation {

    constructor() {
        super("Detect Code/Quotes");
    }

    transform(parseResult:ParseResult) {
        const {mostUsedHeight, mostUsedDistance} = parseResult.globals;

        var foundBlocks = 0;
        const textCombiner = new TextItemCombiner({
            mostUsedDistance: mostUsedDistance
        });

        parseResult.pages.forEach(page => {
            var minX = minXFromBlocks(page.items);
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
                page.items.forEach(block => {
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
                            const combineResult = textCombiner.combine(block.textItems);
                            if (mergeWithPreceedingCodeBlock) {
                                preceedingCodeBlock.textItems = preceedingCodeBlock.textItems.concat(combineResult.textItems);
                                preceedingCodeBlock.parsedElements.add(combineResult.parsedElements);
                            } else {
                                preceedingCodeBlock = new TextItemBlock({
                                    type: CODE_BLOCK,
                                    annotation: ADDED_ANNOTATION,
                                    textItems: combineResult.textItems,
                                    parsedElements: combineResult.parsedElements
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
                page.items = newBlocks;
            }
        });

        return new ParseResult({
            ...parseResult,
            messages: ['Detected ' + foundBlocks + ' code/quote blocks.']
        });

    }

}


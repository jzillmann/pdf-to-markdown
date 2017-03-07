import ToTextItemBlockTransformation from './ToTextItemBlockTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItemBlock from '../TextItemBlock.jsx';
import TextItemCombiner from '../TextItemCombiner.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../Annotation.jsx';
import { FOOTNOTE_BLOCK } from '../MarkdownElements.jsx';

//Detect quotes, code etc.. which is transformed to markdown code syntax
export default class DetectFootnotes extends ToTextItemBlockTransformation {

    constructor() {
        super("Detect Footnotes");
    }

    transform(parseResult:ParseResult) {
        const {mostUsedDistance} = parseResult.globals;
        var foundFootnotes = [];
        const textCombiner = new TextItemCombiner({
            mostUsedDistance: mostUsedDistance,
        });

        parseResult.pages.forEach(page => {
            const newBlocks = [];
            var lastFootnote;
            page.items.forEach(block => {
                newBlocks.push(block);
                if (!block.type && block.textItems[0].y < 200) {
                    const combineResult = textCombiner.combine(block.textItems);
                    if (combineResult.parsedElements.footnotes.length > 0) {
                        block.annotation = REMOVED_ANNOTATION;
                        foundFootnotes.push.apply(foundFootnotes, combineResult.parsedElements.footnotes);
                        lastFootnote = new TextItemBlock({
                            textItems: combineResult.textItems,
                            type: FOOTNOTE_BLOCK,
                            annotation: ADDED_ANNOTATION,
                            parsedElements: combineResult.parsedElements
                        });
                        newBlocks.push(lastFootnote);
                    } else if (lastFootnote) {
                        // likely to be the second line of aboves footnote
                        block.annotation = REMOVED_ANNOTATION;
                        lastFootnote.textItems = lastFootnote.textItems.concat(combineResult.textItems);
                        lastFootnote.parsedElements.add(combineResult.parsedElements);
                        newBlocks[newBlocks.length - 2] = block;
                        newBlocks[newBlocks.length - 1] = lastFootnote;
                    }
                } else {
                    lastFootnote = null;
                }
            });
            page.items = newBlocks;
        });

        return new ParseResult({
            ...parseResult,
            messages: [
                'Detected ' + foundFootnotes.length + ' footnotes:',
                foundFootnotes.join(', ')
            ]
        });

    }

}




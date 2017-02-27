import ToPdfBlockViewTransformation from './ToPdfBlockViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItem from '../TextItem.jsx';
import PdfBlock from '../PdfBlock.jsx';
import TextItemCombiner from '../TextItemCombiner.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../Annotation.jsx';
import { TOC_BLOCK, HEADLINE2 } from '../MarkdownElements.jsx';
import { isDigit } from '../../functions.jsx'

//Detect table of contents pages
export default class DetectTOC extends ToPdfBlockViewTransformation {

    constructor() {
        super("Detect Table of Contents");
    }

    transform(parseResult:ParseResult) {
        const {mostUsedDistance} = parseResult.globals;
        var foundTocPages = 0;
        const maxPagesToEvaluate = Math.min(20, parseResult.content.length);
        const textCombiner = new TextItemCombiner({
            mostUsedDistance: mostUsedDistance
        });


        parseResult.content.slice(0, maxPagesToEvaluate).forEach(page => {
            var linesCount = 0;
            var linesWithDigitsCount = 0;
            var lineItemsWithDigits = [];
            var headlineBlock;
            page.blocks.forEach(block => {
                var blockHasLinesWithDigits = false;
                const itemsGroupedByY = textCombiner.combine(block.textItems).textItems;
                itemsGroupedByY.forEach(lineItem => {
                    linesCount++
                    var lineText = lineItem.text.replace(/\./g, '').trim();
                    var endsWithDigit = false;
                    while (isDigit(lineText.charCodeAt(lineText.length - 1))) {
                        lineText = lineText.substring(0, lineText.length - 2);
                        endsWithDigit = true;
                    }
                    lineText = lineText.trim();
                    if (endsWithDigit) {
                        linesWithDigitsCount++;
                        blockHasLinesWithDigits = true;
                        lineItemsWithDigits.push(new TextItem({
                            ...lineItem,
                            text: lineText
                        }));
                    }
                });
                if (!headlineBlock && !blockHasLinesWithDigits) {
                    headlineBlock = block;
                }
            });

            if (linesWithDigitsCount * 100 / linesCount > 75) {
                foundTocPages++;
                const newBlocks = [];
                page.blocks.forEach((block) => {
                    block.annotation = REMOVED_ANNOTATION;
                    newBlocks.push(block);

                    if (block === headlineBlock) {
                        newBlocks.push(new PdfBlock({
                            textItems: textCombiner.combine(block.textItems).textItems,
                            type: HEADLINE2,
                            annotation: ADDED_ANNOTATION
                        }));
                    }
                });
                newBlocks.push(new PdfBlock({
                    textItems: lineItemsWithDigits,
                    type: TOC_BLOCK,
                    annotation: ADDED_ANNOTATION
                }));
                page.blocks = newBlocks;
            }
        });

        return new ParseResult({
            ...parseResult,
            messages: ['Detected ' + foundTocPages + ' table of content pages']
        });
    }

}

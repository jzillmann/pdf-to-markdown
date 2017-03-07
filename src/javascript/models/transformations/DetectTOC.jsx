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
        const tocPages = [];
        const maxPagesToEvaluate = Math.min(20, parseResult.content.length);
        const textCombiner = new TextItemCombiner({
            mostUsedDistance: mostUsedDistance
        });

        var lastLevel = 0;
        const itemLeveler = new ItemLeveler();
        parseResult.content.slice(0, maxPagesToEvaluate).forEach(page => {
            var linesCount = 0;
            var linesWithDigitsCount = 0;
            var lineItemsWithDigits = [];
            const unknownBlocks = new Set();
            var headlineBlock;
            page.blocks.forEach(block => {
                var blockHasLinesWithDigits = false;
                const itemsGroupedByY = textCombiner.combine(block.textItems).textItems;
                var lastLineTextWithoutNumber;
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
                        if (lastLineTextWithoutNumber) { // 2-line item ?
                            lineText = lastLineTextWithoutNumber + ' ' + lineText;
                            lastLineTextWithoutNumber = null;
                        }
                        linesWithDigitsCount++;
                        blockHasLinesWithDigits = true;
                        lineItemsWithDigits.push(new TextItem({
                            ...lineItem,
                            text: lineText
                        }));
                    } else {
                        lastLineTextWithoutNumber = lineText;
                    }
                });
                if (!blockHasLinesWithDigits) {
                    if (!headlineBlock) {
                        headlineBlock = block;
                    } else {
                        unknownBlocks.add(block);
                    }
                }
            });

            if (linesWithDigitsCount * 100 / linesCount > 75) {
                tocPages.push(page.index + 1);
                const newBlocks = [];
                page.blocks.forEach((block) => {
                    if (!unknownBlocks.has(block)) {
                        block.annotation = REMOVED_ANNOTATION;
                    }
                    newBlocks.push(block);
                    if (block === headlineBlock) {
                        newBlocks.push(new PdfBlock({
                            textItems: textCombiner.combine(block.textItems).textItems,
                            type: HEADLINE2,
                            annotation: ADDED_ANNOTATION
                        }));
                    }
                });
                // lastLevel = processLevels(lineItemsWithDigits, lastLevel);
                itemLeveler.level(lineItemsWithDigits);
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
            globals: {
                ...parseResult.globals,
                tocPages: tocPages

            },
            messages: ['Detected ' + tocPages.length + ' table of content pages']
        });
    }

}


class ItemLeveler {
    constructor() {
        this.levelByMethod = null;
        this.uniqueFonts = [];
        this.headlines = [];
    }

    level(lineItemsWithDigits) {
        if (!this.levelByMethod) {
            const uniqueX = this.calculateUniqueX(lineItemsWithDigits);
            if (uniqueX.length > 1) {
                this.levelByMethod = this.levelByXDiff;
            } else {
                const uniqueFonts = this.calculateUniqueFonts(lineItemsWithDigits);
                if (uniqueFonts.length > 1) {
                    this.uniqueFonts = uniqueFonts;
                    this.levelByMethod = this.levelByFont;
                } else {
                    this.levelByMethod = this.levelToZero;
                }
            }
        }
        this.levelByMethod(lineItemsWithDigits);
    }

    levelByXDiff(lineItemsWithDigits) {
        const uniqueX = this.calculateUniqueX(lineItemsWithDigits);
        lineItemsWithDigits.forEach(item => {
            const level = uniqueX.indexOf(item.x);
            this.headlines.push(new Headline({
                level: level,
                text: item.text
            }));
            item.text = ' '.repeat(level * 3) + '- ' + item.text;
        });
    }

    levelByFont(lineItemsWithDigits) {
        lineItemsWithDigits.forEach(item => {
            const level = this.uniqueFonts.indexOf(item.font);
            this.headlines.push(new Headline({
                level: level,
                text: item.text
            }));
            item.text = ' '.repeat(level * 3) + '- ' + item.text;
        });
    }

    levelToZero(lineItemsWithDigits) {
        lineItemsWithDigits.forEach(item => {
            const level = 0;
            this.headlines.push(new Headline({
                level: level,
                text: item.text
            }));
            item.text = ' '.repeat(level * 3) + '- ' + item.text;
        });
    }

    calculateUniqueX(lineItemsWithDigits) {
        var uniqueX = lineItemsWithDigits.reduce(function(uniquesArray, lineItem) {
            if (uniquesArray.indexOf(lineItem.x) < 0) uniquesArray.push(lineItem.x);
            return uniquesArray;
        }, []);

        uniqueX.sort((a, b) => {
            return a - b
        });

        return uniqueX;
    }

    calculateUniqueFonts(lineItemsWithDigits) {
        var uniqueFont = lineItemsWithDigits.reduce(function(uniquesArray, lineItem) {
            if (uniquesArray.indexOf(lineItem.font) < 0) uniquesArray.push(lineItem.font);
            return uniquesArray;
        }, []);

        return uniqueFont;
    }

}

class Headline {
    constructor(options) {
        this.level = options.level;
        this.text = options.text;
    }
}

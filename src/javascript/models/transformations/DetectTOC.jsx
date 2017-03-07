import ToPdfBlockViewTransformation from './ToPdfBlockViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItem from '../TextItem.jsx';
import PdfBlock from '../PdfBlock.jsx';
import TextItemCombiner from '../TextItemCombiner.jsx';
import HeadlineFinder from '../HeadlineFinder.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../Annotation.jsx';
import { TOC_BLOCK, HEADLINE2, headlineByLevel } from '../MarkdownElements.jsx';
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

        const linkLeveler = new LinkLeveler();
        var tocLinks = [];
        var lastTocPage;
        parseResult.content.slice(0, maxPagesToEvaluate).forEach(page => {
            var linesCount = 0;
            var linesWithDigitsCount = 0;
            var lineItemsWithDigits = [];
            const unknownBlocks = new Set();
            var headlineBlock;
            const pageTocLinks = [];
            page.blocks.forEach(block => {
                var blockHasLinesWithDigits = false;
                const itemsGroupedByY = textCombiner.combine(block.textItems).textItems;
                var lastLineTextWithoutNumber;
                itemsGroupedByY.forEach(lineItem => {
                    linesCount++
                    var lineText = lineItem.text.replace(/\./g, '').trim();
                    var endsWithDigit = false;
                    var digits = [];
                    while (isDigit(lineText.charCodeAt(lineText.length - 1))) {
                        digits.unshift(lineText.charAt(lineText.length - 1));
                        lineText = lineText.substring(0, lineText.length - 1);
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
                        pageTocLinks.push(new TocLink({
                            pageNumber: parseInt(digits.join('')),
                            textItem: new TextItem({
                                ...lineItem,
                                text: lineText
                            })
                        }));
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

            // page has been processed
            if (linesWithDigitsCount * 100 / linesCount > 75) {
                tocPages.push(page.index + 1);
                lastTocPage = page;
                linkLeveler.levelPageItems(pageTocLinks);
                tocLinks = tocLinks.concat(pageTocLinks);

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
                page.blocks = newBlocks;
            }
        });

        //all  pages have been processed
        var foundHeadlines = tocLinks.length;
        const notFoundHeadlines = [];
        if (tocPages.length > 0) {
            tocLinks.forEach(tocLink => {
                var linkedPage = parseResult.content[tocLink.pageNumber - 1];
                var foundHeadline = false;
                if (linkedPage) {
                    foundHeadline = findHeadline(linkedPage, tocLink, textCombiner);
                    if (!foundHeadline) { // pages are off by 1 ?
                        linkedPage = parseResult.content[tocLink.pageNumber];
                        if (linkedPage) {
                            foundHeadline = findHeadline(linkedPage, tocLink, textCombiner);
                        }
                    }
                } else {
                    //TODO sometimes pages are off. We could try the page range from pre to next ...
                }
                if (!foundHeadline) {
                    notFoundHeadlines.push(tocLink);
                }
            });
            lastTocPage.blocks.push(new PdfBlock({
                textItems: tocLinks.map(tocLink => {
                    tocLink.textItem.text = ' '.repeat(tocLink.level * 3) + '- ' + tocLink.textItem.text;
                    return tocLink.textItem
                }),
                type: TOC_BLOCK,
                annotation: ADDED_ANNOTATION
            }));
        }

        const messages = [];
        messages.push('Detected ' + tocPages.length + ' table of content pages');
        if (foundHeadlines > 0) {
            messages.push('Found TOC headlines: ' + (foundHeadlines - notFoundHeadlines.length) + '/' + foundHeadlines);
        }
        if (notFoundHeadlines.length > 0) {
            messages.push('Missing TOC headlines: ' + notFoundHeadlines.map(tocLink => tocLink.textItem.text + '=>' + tocLink.pageNumber));
        }
        return new ParseResult({
            ...parseResult,
            globals: {
                ...parseResult.globals,
                tocPages: tocPages

            },
            messages: messages
        });
    }

}

function findHeadline(page, tocLink, textCombiner) {
    const headline = tocLink.textItem.text;
    const headlineFinder = new HeadlineFinder({
        headline: headline
    });
    var blockIndex = 0;
    var lastBlock;
    for ( var block of page.blocks ) {
        const itemsGroupedByY = textCombiner.combine(block.textItems).textItems;
        for ( var item of itemsGroupedByY ) {
            const headlineItems = headlineFinder.consume(item);
            if (headlineItems) {
                const usedItems = headlineFinder.stackedTextItems;
                block.annotation = REMOVED_ANNOTATION;
                if (usedItems.length > itemsGroupedByY.length) {
                    // 2 line headline
                    lastBlock.annotation = REMOVED_ANNOTATION;
                }
                page.blocks.splice(blockIndex + 1, 0, new PdfBlock({
                    textItems: [new TextItem({
                        ...usedItems[0],
                        text: headline
                    })],
                    type: headlineByLevel(tocLink.level + 2),
                    annotation: ADDED_ANNOTATION
                }));
                return true;
            }
        }
        blockIndex++;
        lastBlock = block;
    }
    return false;
}


class LinkLeveler {
    constructor() {
        this.levelByMethod = null;
        this.uniqueFonts = [];
    }

    levelPageItems(tocLinks:TocLink[]) {
        if (!this.levelByMethod) {
            const uniqueX = this.calculateUniqueX(tocLinks);
            if (uniqueX.length > 1) {
                this.levelByMethod = this.levelByXDiff;
            } else {
                const uniqueFonts = this.calculateUniqueFonts(tocLinks);
                if (uniqueFonts.length > 1) {
                    this.uniqueFonts = uniqueFonts;
                    this.levelByMethod = this.levelByFont;
                } else {
                    this.levelByMethod = this.levelToZero;
                }
            }
        }
        this.levelByMethod(tocLinks);
    }

    levelByXDiff(tocLinks) {
        const uniqueX = this.calculateUniqueX(tocLinks);
        tocLinks.forEach(link => {
            link.level = uniqueX.indexOf(link.textItem.x);
        });
    }

    levelByFont(tocLinks) {
        tocLinks.forEach(link => {
            link.level = this.uniqueFonts.indexOf(link.textItem.font);
        });
    }

    levelToZero(tocLinks) {
        tocLinks.forEach(link => {
            link.level = 0;
        });
    }

    calculateUniqueX(tocLinks) {
        var uniqueX = tocLinks.reduce(function(uniquesArray, link) {
            if (uniquesArray.indexOf(link.textItem.x) < 0) uniquesArray.push(link.textItem.x);
            return uniquesArray;
        }, []);

        uniqueX.sort((a, b) => {
            return a - b
        });

        return uniqueX;
    }

    calculateUniqueFonts(tocLinks) {
        var uniqueFont = tocLinks.reduce(function(uniquesArray, link) {
            if (uniquesArray.indexOf(link.textItem.font) < 0) uniquesArray.push(link.textItem.font);
            return uniquesArray;
        }, []);

        return uniqueFont;
    }

}

class TocLink {
    constructor(options) {
        this.textItem = options.textItem;
        this.pageNumber = options.pageNumber;
        this.level = 0;
    }
}

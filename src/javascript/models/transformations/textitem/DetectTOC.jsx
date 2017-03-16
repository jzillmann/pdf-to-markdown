import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import TextItem from '../../TextItem.jsx';
import HeadlineFinder from '../../HeadlineFinder.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION, DETECTED_ANNOTATION } from '../../Annotation.jsx';
import ElementType from '../../ElementType.jsx';
import { headlineByLevel } from '../../ElementType.jsx';
import { isDigit, wordMatch } from '../../../functions.jsx'

//Detect table of contents pages
export default class DetectTOC extends ToTextItemTransformation {

    constructor() {
        super("Detect TOC");
    }

    transform(parseResult:ParseResult) {
        const tocPages = [];
        const maxPagesToEvaluate = Math.min(20, parseResult.pages.length);

        const linkLeveler = new LinkLeveler();
        var tocLinks = [];
        var lastTocPage;
        var headlineItem;
        parseResult.pages.slice(0, maxPagesToEvaluate).forEach(page => {
            const lineItemsWithDigits = [];
            const unknownLines = new Set();
            const pageTocLinks = [];
            var lastLineTextWithoutNumber;
            var lastLine;
            page.items.forEach(line => {
                var lineText = line.text.replace(/\./g, '').trim();
                var endsWithDigit = false;
                var digits = [];
                while (isDigit(lineText.charCodeAt(lineText.length - 1))) {
                    digits.unshift(lineText.charAt(lineText.length - 1));
                    lineText = lineText.substring(0, lineText.length - 1);
                    endsWithDigit = true;
                }
                lineText = lineText.trim();
                if (endsWithDigit) {
                    endsWithDigit = true;
                    if (lastLineTextWithoutNumber) { // 2-line item ?
                        lineText = lastLineTextWithoutNumber + ' ' + lineText;
                        lastLineTextWithoutNumber = null;
                    }
                    pageTocLinks.push(new TocLink({
                        pageNumber: parseInt(digits.join('')),
                        textItem: new TextItem({
                            ...line,
                            text: lineText
                        })
                    }));
                    lineItemsWithDigits.push(new TextItem({
                        ...line,
                        text: lineText
                    }));
                    lastLineTextWithoutNumber = null;
                } else {
                    if (!headlineItem) {
                        headlineItem = line;
                    } else {
                        if (lastLineTextWithoutNumber) {
                            unknownLines.add(lastLine);
                        }
                        lastLineTextWithoutNumber = lineText;
                        lastLine = line;
                    }
                }
            });

            // page has been processed
            if (lineItemsWithDigits.length * 100 / page.items.length > 75) {
                tocPages.push(page.index + 1);
                lastTocPage = page;
                linkLeveler.levelPageItems(pageTocLinks);
                tocLinks = tocLinks.concat(pageTocLinks);

                const newBlocks = [];
                page.items.forEach((line) => {
                    if (!unknownLines.has(line)) {
                        line.annotation = REMOVED_ANNOTATION;
                    }
                    newBlocks.push(line);
                    if (line === headlineItem) {
                        newBlocks.push(new TextItem({
                            ...line,
                            type: ElementType.H2,
                            annotation: ADDED_ANNOTATION
                        }));
                    }
                });
                page.items = newBlocks;
            } else {
                headlineItem = null;
            }
        });

        //all  pages have been processed
        var foundHeadlines = tocLinks.length;
        const notFoundHeadlines = [];
        const foundBySize = [];
        const headlineTypeToHeightRange = {}; //H1={min:23, max:25}

        if (tocPages.length > 0) {
            // Add TOC items
            tocLinks.forEach(tocLink => {
                lastTocPage.items.push(new TextItem({
                    text: ' '.repeat(tocLink.level * 3) + '- ' + tocLink.textItem.text,
                    type: ElementType.TOC,
                    annotation: ADDED_ANNOTATION
                }));
            });

            // Add linked headers
            const pageMapping = detectPageMappingNumber(parseResult.pages.filter(page => page.index > lastTocPage.index), tocLinks);
            tocLinks.forEach(tocLink => {
                var linkedPage = parseResult.pages[tocLink.pageNumber + pageMapping];
                var foundHealineItems;
                if (linkedPage) {
                    foundHealineItems = findHeadlineItems(linkedPage, tocLink.textItem.text);
                    if (!foundHealineItems) { // pages are off by 1 ?
                        linkedPage = parseResult.pages[tocLink.pageNumber + pageMapping + 1];
                        if (linkedPage) {
                            foundHealineItems = findHeadlineItems(linkedPage, tocLink.textItem.text);
                        }
                    }
                }
                if (foundHealineItems) {
                    addHeadlineItems(linkedPage, tocLink, foundHealineItems, headlineTypeToHeightRange)
                } else {
                    notFoundHeadlines.push(tocLink);
                }
            });

            // Try to find linked headers by height
            var fromPage = lastTocPage.index + 2;
            var lastNotFound = [];
            const rollupLastNotFound = (currentPageNumber) => {
                if (lastNotFound.length > 0) {
                    lastNotFound.forEach(notFoundTocLink => {
                        const headlineType = headlineByLevel(notFoundTocLink.level + 2);
                        const heightRange = headlineTypeToHeightRange[headlineType];
                        if (heightRange) {
                            const textItem = findHeadlinesBySize(parseResult.pages, notFoundTocLink, heightRange, fromPage, currentPageNumber);
                            if (textItem) {
                                textItem.type = headlineType;
                                textItem.annotation = DETECTED_ANNOTATION;
                                foundBySize.push(textItem.text);
                            }
                        }
                    });
                    lastNotFound = [];
                }
            }
            if (notFoundHeadlines.length > 0) {
                tocLinks.forEach(tocLink => {
                    if (notFoundHeadlines.includes(tocLink)) {
                        lastNotFound.push(tocLink);
                    } else {
                        rollupLastNotFound(tocLink.pageNumber);
                        fromPage = tocLink.pageNumber;
                    }
                });
                if (lastNotFound.length > 0) {
                    rollupLastNotFound(parseResult.pages.length);
                }
            }
        }



        const messages = [];
        messages.push('Detected ' + tocPages.length + ' table of content pages');
        if (tocPages.length > 0) {
            messages.push('Found TOC headlines: ' + (foundHeadlines - notFoundHeadlines.length + foundBySize.length) + '/' + foundHeadlines);
            messages.push('TOC headline heights: ' + JSON.stringify(headlineTypeToHeightRange));
        }
        if (notFoundHeadlines.length > 0) {
            messages.push('Missing TOC headlines (by text): ' + notFoundHeadlines.map(tocLink => tocLink.textItem.text + '=>' + tocLink.pageNumber));
            messages.push('Found TOC headlines (by size): ' + foundBySize);
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

//Find out how the TOC page link actualy translates to the page.index
function detectPageMappingNumber(pages, tocLinks) {
    for ( var tocLink of tocLinks ) {
        const page = findPageWithHeadline(pages, tocLink.textItem.text);
        if (page) {
            return page.index - tocLink.pageNumber;
        }
    }
    return null;
}

function findPageWithHeadline(pages, headline) {
    for ( var page of pages ) {
        if (findHeadlineItems(page, headline)) {
            return page;
        }
    }
    return null;
}

function findHeadlineItems(page, headline) {
    const headlineFinder = new HeadlineFinder({
        headline: headline
    });
    var lineIndex = 0;
    for ( var line of page.items ) {
        const headlineItems = headlineFinder.consume(line);
        if (headlineItems) {
            return {
                lineIndex: lineIndex,
                headlineItems: headlineItems
            };
        }
        lineIndex++;
    }
    return null;
}

function addHeadlineItems(page, tocLink, foundItems, headlineTypeToHeightRange) {
    foundItems.headlineItems.forEach(item => item.annotation = REMOVED_ANNOTATION);
    const headlineType = headlineByLevel(tocLink.level + 2);
    const headlineHeight = foundItems.headlineItems.reduce((max, item) => Math.max(max, item.height), 0);
    page.items.splice(foundItems.lineIndex + 1, 0, new TextItem({
        ...foundItems.headlineItems[0],
        text: tocLink.textItem.text,
        height: headlineHeight,
        type: headlineType,
        annotation: ADDED_ANNOTATION
    }));
    var range = headlineTypeToHeightRange[headlineType];
    if (range) {
        range.min = Math.min(range.min, headlineHeight);
        range.max = Math.max(range.max, headlineHeight);
    } else {
        range = {
            min: headlineHeight,
            max: headlineHeight
        };
        headlineTypeToHeightRange[headlineType] = range;
    }
}

function findHeadlinesBySize(pages, tocLink, heightRange, fromPage, toPage) {
    for (var i = fromPage; i <= toPage; i++) {
        const page = pages[i - 1];
        for ( var line of page.items ) {
            if (!line.type && !line.annotation && line.height >= heightRange.min && line.height <= heightRange.max) {
                const match = wordMatch(tocLink.textItem.text, line.text);
                if (match >= 0.5) {
                    return line;
                }
            }
        }
    }
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

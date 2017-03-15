import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import TextItem from '../../TextItem.jsx';
import HeadlineFinder from '../../HeadlineFinder.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../../Annotation.jsx';
import ElementType from '../../ElementType.jsx';
import { headlineByLevel } from '../../ElementType.jsx';
import { isDigit } from '../../../functions.jsx'

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
        if (tocPages.length > 0) {
            tocLinks.forEach(tocLink => {
                var linkedPage = parseResult.pages[tocLink.pageNumber - 1];
                var foundHeadline = false;
                if (linkedPage) {
                    foundHeadline = findHeadline(linkedPage, tocLink);
                    if (!foundHeadline) { // pages are off by 1 ?
                        linkedPage = parseResult.pages[tocLink.pageNumber];
                        if (linkedPage) {
                            foundHeadline = findHeadline(linkedPage, tocLink);
                        }
                    }
                } else {
                    //TODO sometimes pages are off. We could try the page range from pre to next ...
                }
                if (!foundHeadline) {
                    notFoundHeadlines.push(tocLink);
                }
            });
            tocLinks.forEach(tocLink => {
                lastTocPage.items.push(new TextItem({
                    text: ' '.repeat(tocLink.level * 3) + '- ' + tocLink.textItem.text,
                    type: ElementType.TOC,
                    annotation: ADDED_ANNOTATION
                }));
            });
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

function findHeadline(page, tocLink) {
    const headline = tocLink.textItem.text;
    const headlineFinder = new HeadlineFinder({
        headline: headline
    });
    var lineIndex = 0;
    for ( var line of page.items ) {
        const headlineItems = headlineFinder.consume(line);
        if (headlineItems) {
            headlineItems.forEach(item => item.annotation = REMOVED_ANNOTATION);
            page.items.splice(lineIndex + 1, 0, new TextItem({
                ...headlineItems[0],
                text: headline,
                type: headlineByLevel(tocLink.level + 2),
                annotation: ADDED_ANNOTATION
            }));
            return true;
        }
        lineIndex++;
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

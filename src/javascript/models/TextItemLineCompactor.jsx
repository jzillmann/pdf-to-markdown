import TextItem from './TextItem.jsx';
import { ParsedElements } from './PageItem.jsx';
import { isNumber } from '../functions.jsx'
import { sortByX } from '../textItemFunctions.jsx'
import { prefixAfterWhitespace, suffixBeforeWhitespace } from '../functions.jsx';

// Compact text items which have been grouped to a line (through TextItemLineCompactor) to a single TextItem doing inline transformations like 
//'whitespace removal', bold/emphasis annotation, link-detection, etc..
export default class TextItemLineCompactor {

    constructor(fontToFormats) {
        this.fontToFormats = fontToFormats;
    }

    // returns a CombineResult 
    compact(lineItems: TextItem[]) {
        if (lineItems.length < 2) {
            throw "Must be at least 2 line items, but was " + lineItems;
        }

        // we can't trust order of occurence, esp. footnoteLinks like to come last
        sortByX(lineItems);

        const formatter = new Formatter(this.fontToFormats);
        var [resolvedLineItems, parsedElements] = this.resolveSpecialElements(lineItems);
        resolvedLineItems.forEach(item => formatter.consume(item));
        resolvedLineItems = formatter.getResults();
        parsedElements.inlineFormats = formatter.inlineFormats;
        // const [lineFormat, unopenedFormat, unclosedFormat] = this.addFormats(resolvedLineItems, parsedElements);

        var combinedItem;
        if (resolvedLineItems.length == 1) {
            combinedItem = resolvedLineItems[0];
        } else {
            var text = '';
            var maxHeight = 0;
            var widthSum = 0;
            var lastItem;
            resolvedLineItems.forEach(item => {
                if (lastItem && !text.endsWith(' ') && !item.text.startsWith(' ')) {
                    const xDistance = item.x - lastItem.x - lastItem.width;
                    if (xDistance >= 5) {
                        text += ' ';
                    }
                }
                text += item.text;
                widthSum += item.width;
                lastItem = item;
                maxHeight = Math.max(maxHeight, item.height);
            });
            combinedItem = new TextItem({
                ...resolvedLineItems[0],
                text: text,
                height: maxHeight,
                width: widthSum
            });
        }
        combinedItem.parsedElements = parsedElements;
        combinedItem.lineFormat = formatter.lineFormat;
        combinedItem.unopenedFormat = formatter.unopenedFormat;
        combinedItem.unclosedFormat = formatter.unclosedFormat;
        return combinedItem;
    }


    resolveSpecialElements(lineItems) {
        const footnoteLinks = [];
        const footnotes = [];
        const basicY = lineItems[0].y;
        const newLineItems = [];
        var stashedNumberItems = [];

        const commitStashedNumbers = (nextItem) => {
            if (stashedNumberItems.length > 0) {
                const joinedNumber = stashedNumberItems.map(footnoteLinkItem => footnoteLinkItem.text).join('');
                if (stashedNumberItems[0].y > basicY) { // footnote link
                    newLineItems.push(new TextItem({
                        ...stashedNumberItems[0],
                        //TODO make fomatting configurable
                        // text: `<sup>[${joinedNumber}](#${joinedNumber})</sup>`
                        text: `^${joinedNumber}`
                    }));
                    footnoteLinks.push(parseInt(joinedNumber));
                } else if (nextItem && nextItem.y < stashedNumberItems[0].y) { // footnote
                    //TODO womb comp [29] => ydiff == 0
                    newLineItems.push(new TextItem({
                        ...stashedNumberItems[0],
                        text: `(^${ joinedNumber}): `
                    }));
                    footnotes.push(joinedNumber);
                } else {
                    stashedNumberItems.forEach(number => newLineItems.push(number));
                }

                stashedNumberItems = [];
            }
        };

        lineItems.forEach(item => {
            if (newLineItems.length == 0 && item.text.trim().length == 0) {
                // skip whitespace on the beginning of a line
            } else {
                const isANumber = isNumber(item.text.trim());
                if (isANumber) {
                    stashedNumberItems.push(item);
                } else {
                    if (stashedNumberItems.length > 0) {
                        commitStashedNumbers(item);
                    }
                    newLineItems.push(item);
                }
            }
        });
        commitStashedNumbers();


        return [newLineItems, new ParsedElements({
            footnoteLinks: footnoteLinks,
            footnotes: footnotes
        })];
    }

}

class Formatter {

    constructor(fontToFormats) {
        this.fontToFormats = fontToFormats;

        this.resultItems = [];
        this.lineFormat;
        this.unopenedFormat;
        this.unclosedFormat;

        this.openFormat;
        this.stashedItems = [];
        this.inlineFormats = 0;
        this.lastItem;
    }


    consume(item) {
        const formatType = this.fontToFormats.get(item.font);
        if (this.openFormat && formatType !== this.openFormat) {
            this.flushStash(false);
        }
        if (formatType.needFormat) {
            this.openFormat = formatType;
            this.stashedItems.push(item);
        } else {
            this.resultItems.push(item);
        }
    }

    getResults() {
        if (this.openFormat) {
            this.flushStash(true);
        }
        return this.resultItems;
    }

    flushStash(formatToEndOfLine) {
        const formatFromBeginningOfLine = this.resultItems == 0;
        if (formatFromBeginningOfLine) {
            if (formatToEndOfLine) {
                this.lineFormat = this.openFormat;
                this.moveStashItemsToResult();
            } else {
                this.unopenedFormat = this.openFormat;
                const newLastItem = this.newClosingItem(this.stashedItems.pop());
                this.moveStashItemsToResult();
                this.resultItems.push(newLastItem);
            }
        } else {
            if (formatToEndOfLine) {
                this.unclosedFormat = this.openFormat;
                const newFirstItem = this.newOpeningItem(this.stashedItems.shift());
                this.resultItems.push(newFirstItem);
                this.moveStashItemsToResult();
            } else {
                this.inlineFormats++;
                if (this.stashedItems.length == 1) {
                    const onlyItem = this.stashedItems.pop();
                    if (onlyItem.text.trim().length > 0) {
                        const onlyItemFormatted = this.newCompleteItem(onlyItem);
                        this.resultItems.push(onlyItemFormatted);
                    }
                    this.moveStashItemsToResult();
                } else {
                    const firstItem = this.newOpeningItem(this.stashedItems.shift());
                    const lastItem = this.newClosingItem(this.stashedItems.pop());
                    this.resultItems.push(firstItem);
                    this.moveStashItemsToResult();
                    this.resultItems.push(lastItem);
                }
            }
        }
    }

    moveStashItemsToResult() {
        this.resultItems.push(...this.stashedItems);
        this.stashedItems = [];
        this.openFormat = null;
    }

    newOpeningItem(item) {
        return new TextItem({
            ...item,
            text: prefixAfterWhitespace(this.openFormat.startSymbol, item.text)
        });
    }

    newClosingItem(item) {
        return new TextItem({
            ...item,
            text: suffixBeforeWhitespace(item.text, this.openFormat.endSymbol)
        });
    }

    newCompleteItem(item) {
        return new TextItem({
            ...item,
            text: suffixBeforeWhitespace(prefixAfterWhitespace(this.openFormat.startSymbol, item.text), this.openFormat.endSymbol)
        });
    }

}

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

        const [resolvedLineItems, parsedElements] = this.resolveSpecialElements(lineItems);
        const [lineFormat, unopenedFormat, unclosedFormat] = this.addFormats(resolvedLineItems, parsedElements);

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
        combinedItem.lineFormat = lineFormat;
        combinedItem.unopenedFormat = unopenedFormat;
        combinedItem.unclosedFormat = unclosedFormat;
        return combinedItem;
    }

    addFormats(resolvedLineItems, parsedElements) {
        var inlineFormats = 0;
        var openFormatType;
        var openFormatItem;
        var openFormatIndex;
        var lastItem;

        var lineFormat;
        var unopenedFormat;
        var unclosedFormat;

        const addStartSymbol = () => {
            resolvedLineItems.splice(openFormatIndex, 1, new TextItem({
                ...openFormatItem,
                text: prefixAfterWhitespace(openFormatType.startSymbol, openFormatItem.text)
            }));
        }
        const addEndSymbol = (index) => {
            resolvedLineItems.splice(index, 1, new TextItem({
                ...lastItem,
                text: suffixBeforeWhitespace(lastItem.text, openFormatType.endSymbol)
            }));
        }
        const addCompleteSymbol = () => {
            resolvedLineItems.splice(openFormatIndex, 1, new TextItem({
                ...openFormatItem,
                text: suffixBeforeWhitespace(prefixAfterWhitespace(openFormatType.startSymbol, openFormatItem.text), openFormatType.endSymbol)
            }));
        }

        const rollupOpenFormat = (endIndex) => {
            const formatFromBeginningOfLine = openFormatIndex == 0;
            const formatToEndOfLine = endIndex == resolvedLineItems.length - 1;
            if (formatFromBeginningOfLine) {
                if (formatToEndOfLine) {
                    lineFormat = openFormatType;
                } else {
                    unopenedFormat = openFormatType;
                    addEndSymbol(endIndex);
                }
            } else {
                if (formatToEndOfLine) {
                    unclosedFormat = openFormatType;
                    addStartSymbol();
                } else {
                    inlineFormats++;
                    if (lastItem === openFormatItem) {
                        addCompleteSymbol();
                    } else {
                        addStartSymbol();
                        addEndSymbol();
                    }
                }
            }
        };

        resolvedLineItems.slice().forEach((item, i) => {
            const formatType = this.fontToFormats.get(item.font);
            if (openFormatType) {
                if (formatType !== openFormatType) { //closin existing format
                    rollupOpenFormat(i - 1);
                    openFormatType = formatType.needFormat ? formatType : null;
                    openFormatItem = formatType.needFormat ? item : null;
                    openFormatIndex = formatType.needFormat ? i : null;
                }
            } else {
                if (formatType.needFormat) {
                    openFormatType = formatType;
                    openFormatItem = item;
                    openFormatIndex = i;
                }
            }
            lastItem = item;
        });
        if (openFormatType) {
            rollupOpenFormat(resolvedLineItems.length - 1);
        }
        parsedElements.inlineFormats = inlineFormats;
        return [lineFormat, unopenedFormat, unclosedFormat];
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

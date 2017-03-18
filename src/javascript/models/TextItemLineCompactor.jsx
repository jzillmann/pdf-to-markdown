import TextItem from './TextItem.jsx';
import { ParsedElements } from './PageItem.jsx';
import { isNumber } from '../functions.jsx'
import { sortByX } from '../textItemFunctions.jsx'

// Compact text items which have been grouped to a line (through TextItemLineCompactor) to a single TextItem doing inline transformations like 
//'whitespace removal', bold/emphasis annotation, link-detection, etc..
export default class TextItemLineCompactor {

    constructor(options) {
        if (options) {
            this.transformEmphasis = options.transformEmphasis || true;
        }
    }

    // returns a CombineResult 
    compact(lineItems: TextItem[]) {
        if (lineItems.length < 2) {
            throw "Must be at least 2 line items, but was " + lineItems;
        }

        // we can't trust order of occurence, esp. footnoteLinks like to come last
        sortByX(lineItems);

        var combinedItem;
        const [resolvedLineItems, parsedElements] = this.resolveSpecialElements(lineItems);
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

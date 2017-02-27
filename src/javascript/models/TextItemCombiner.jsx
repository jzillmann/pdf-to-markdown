import TextItem from './TextItem.jsx';
import { isNumber } from '../functions.jsx'
import { sortByX } from '../textItemFunctions.jsx'

//Combines text items which are on the same Y at the same time doing inline transformations like 
//'whitespace removal', bold/emphasis annotation, link-detection, etc..
export default class TextItemCombiner {

    constructor(options) {
        this.transformEmphasis = options.transformEmphasis || true;
        this.mostUsedDistance = options.mostUsedDistance || 12;
    }

    // returns a CombineResult 
    combine(textItems: TextItem[]) {
        if (textItems.length == 0) {
            return new CombineResult({
                textItems: resultItems,
                parsedElements: {}
            });
        }
        const resultItems = [];
        const [groupedItems, parsedElements] = this.groupByFollowingY(textItems);
        groupedItems.forEach(itemGroup => {
            if (itemGroup.length == 1) {
                resultItems.push(itemGroup[0]);
            } else {
                var text = '';
                var maxHeight = 0;
                var widthSum = 0;
                var lastItem;
                itemGroup.forEach(item => {
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
                resultItems.push(new TextItem({
                    ...itemGroup[0],
                    text: text,
                    height: maxHeight,
                    width: widthSum
                }));
            }
        });

        //TODO whitespace removal
        //TODO bold/emphasis

        return new CombineResult({
            textItems: resultItems,
            parsedElements: parsedElements
        });
    }

    groupByFollowingY(textItems) {
        const footnoteLinks = [];
        const footnotes = [];


        var lines = this.groupItemsByLine(textItems);
        lines = lines.map(lineItems => {
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
                            text: `(^${ joinedNumber}):`
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
                    const isANumber = isNumber(item.text);
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
            return newLineItems;
        });


        return [lines, new ParsedElements({
            footnoteLinks: footnoteLinks,
            footnotes: footnotes
        })];
    }

    groupItemsByLine(textItems:TextItem[]) {
        const lines = [];
        var currentLine = [];
        textItems.forEach(item => {
            if (currentLine.length > 0 && Math.abs(currentLine[0].y - item.y) >= this.mostUsedDistance / 2) {
                lines.push(currentLine);
                currentLine = [];
            }
            currentLine.push(item);
        });
        lines.push(currentLine);

        lines.forEach(lineItems => {
            // we can't trust order of occurence, esp. footnoteLinks like to come last
            sortByX(lineItems);
        });
        return lines;
    }

}

//Result of the TextItemCombiner#combine()
export class CombineResult {

    constructor(options) {
        this.textItems = options.textItems;
        this.parsedElements = options.parsedElements;
    }

}

export class ParsedElements {

    constructor(options) {
        this.footnoteLinks = options.footnoteLinks;
        this.footnotes = options.footnotes;
    }

    add(parsedElements:ParsedElements) {
        this.footnoteLinks = this.footnoteLinks.concat(parsedElements.footnoteLinks);
        this.footnotes = this.footnotes.concat(parsedElements.footnotes);
    }

}


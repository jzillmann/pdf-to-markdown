import TextItem from './TextItem.jsx';
import { isNumber } from '../functions.jsx'

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
        const yArrays = [];
        const footnotes = [];
        var itemsWithSameY = [];
        var lastItem;


        const wrapUpLine = () => {
            // we can't trust order of occurence, esp. footnotes like to come last
            itemsWithSameY.sort((a, b) => {
                return a.x - b.x;
            });
            const finalArray = [];
            const basicY = itemsWithSameY[0].y;
            var savedFootnoteItems = [];
            const commitSavedFootnotes = () => {
                if (savedFootnoteItems.length > 0) {
                    const footnoteNumber = savedFootnoteItems.map(footnoteItem => footnoteItem.text).join('');
                    finalArray.push(new TextItem({
                        ...savedFootnoteItems[0],
                        //TODO make fomatting configurable
                        // text: `<sup>[${footnoteNumber}](#${footnoteNumber})</sup>`
                        text: `*${footnoteNumber}`
                    }));
                    savedFootnoteItems = [];
                    footnotes.push(parseInt(footnoteNumber));
                }
            };

            itemsWithSameY.forEach(item => {
                const isFootnote = item.y > basicY && isNumber(item.text);
                if (isFootnote) {
                    savedFootnoteItems.push(item);
                } else {
                    if (savedFootnoteItems.length > 0) {
                        commitSavedFootnotes();
                    }
                    finalArray.push(item);
                }
            });
            commitSavedFootnotes();
            yArrays.push(finalArray);
            itemsWithSameY = [];
        };

        textItems.forEach(item => {
            if (lastItem) {
                if (Math.abs(lastItem.y - item.y) > this.mostUsedDistance / 2) {
                    wrapUpLine();
                }
            }
            itemsWithSameY.push(item);
            lastItem = item;
        // }
        });
        wrapUpLine();

        return [yArrays, new ParsedElements({
            footnotes: footnotes
        })];
    }
}

//Result of the TextItemCombiner#combine()
export class CombineResult {

    constructor(options) {
        this.textItems = options.textItems;
        this.footnotes = options.footnotes;
        this.parsedElements = options.parsedElements;
    }

}

export class ParsedElements {

    constructor(options) {
        this.footnotes = options.footnotes;
    }

    add(parsedElements:ParsedElements) {
        this.footnotes = this.footnotes.concat(parsedElements.footnotes);
    }

}


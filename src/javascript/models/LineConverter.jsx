import TextItem from './TextItem.jsx';
import Word from './Word.jsx';
import WordType from './markdown/WordType.jsx';
import LineItem from './LineItem.jsx';
import StashingStream from './StashingStream.jsx';
import { ParsedElements } from './PageItem.jsx';
import { isNumber } from '../functions.jsx'
import { sortByX } from '../pageItemFunctions.jsx'

// Converts text items which have been grouped to a line (through TextItemLineGrouper) to a single LineItem doing inline transformations like 
//'whitespace removal', bold/emphasis annotation, link-detection, etc..
export default class LineConverter {

    constructor(fontToFormats) {
        this.fontToFormats = fontToFormats;
    }

    // returns a CombineResult 
    compact(textItems: TextItem[]) {
        // we can't trust order of occurence, esp. footnoteLinks like to come last
        sortByX(textItems);

        const wordStream = new WordDetectionStream(this.fontToFormats);
        wordStream.consumeAll(textItems.map(item => new TextItem({
            ...item
        })));
        const words = wordStream.complete();

        var maxHeight = 0;
        var widthSum = 0;
        textItems.forEach(item => {
            maxHeight = Math.max(maxHeight, item.height);
            widthSum += item.width;
        });
        return new LineItem({
            x: textItems[0].x,
            y: textItems[0].y,
            height: maxHeight,
            width: widthSum,
            words: words,
            parsedElements: new ParsedElements({
                footnoteLinks: wordStream.footnoteLinks,
                footnotes: wordStream.footnotes,
                containLinks: wordStream.containLinks
            })
        });

    }

}

class WordDetectionStream extends StashingStream {

    constructor(fontToFormats) {
        super();
        this.fontToFormats = fontToFormats;
        this.footnoteLinks = [];
        this.footnotes = [];
        this.formattedWords = 0
        this.containLinks = false;

        this.firstY;
        this.stashedNumber = false;
        this.currentItem;
    }

    shouldStash(item) { // eslint-disable-line no-unused-vars
        if (!this.firstY) {
            this.firstY = item.y;
        }
        this.currentItem = item;
        return true;
    }

    onPushOnStash(item) { // eslint-disable-line no-unused-vars
        this.stashedNumber = isNumber(item.text.trim());
    }

    doMatchesStash(lastItem, item) {
        const lastItemFormat = this.fontToFormats.get(lastItem.font);
        const itemFormat = this.fontToFormats.get(item.font);
        if (lastItemFormat !== itemFormat) {
            return false;
        }
        const itemIsANumber = isNumber(item.text.trim());
        return this.stashedNumber == itemIsANumber;
    }

    doFlushStash(stash, results) {
        if (this.stashedNumber) {
            const joinedNumber = stash.map(item => item.text).join('').trim();
            if (stash[0].y > this.firstY) { // footnote link
                results.push(new Word({
                    string: `${joinedNumber}`,
                    type: WordType.FOOTNOTE_LINK
                }));
                this.footnoteLinks.push(parseInt(joinedNumber));
            } else if (this.currentItem && this.currentItem.y < stash[0].y) { // footnote
                results.push(new Word({
                    string: `${joinedNumber}`,
                    type: WordType.FOOTNOTE
                }));
                this.footnotes.push(joinedNumber);
            } else {
                this.copyStashItemsAsText(stash, results);
            }
        } else {
            this.copyStashItemsAsText(stash, results);
        }
    }

    copyStashItemsAsText(stash, results) {
        const format = this.fontToFormats.get(stash[0].font);
        results.push(...this.itemsToWords(stash, format));
    }

    itemsToWords(items, format) {
        const combinedText = combineText(items);
        // const combinedText = items.map(textItem => textItem.text).join('');
        const words = combinedText.split(' ');
        return words.filter(w => w.trim().length > 0).map(word => {
            if (word.startsWith('http:')) {
                this.containLinks = true;
                return new Word({
                    string: word,
                    type: WordType.LINK
                });
            } else if (word.startsWith('www.')) {
                this.containLinks = true;
                word = `http://${word}`
                return new Word({
                    string: word,
                    type: WordType.LINK
                });
            }

            return new Word({
                string: word,
                type: format
            });
        });
    }
}


function combineText(textItems) {
    var text = '';
    var lastItem;
    textItems.forEach(textItem => {
        if (lastItem && !text.endsWith(' ') && !textItem.text.startsWith(' ')) {
            const xDistance = textItem.x - lastItem.x - lastItem.width;
            if (xDistance > 5) {
                text += ' ';
            }
        }
        text += textItem.text;
        lastItem = textItem;
    });
    return text;
}

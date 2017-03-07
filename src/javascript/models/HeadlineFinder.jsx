import { normalizedCharCodeArray } from '../functions.jsx'

export default class HeadlineFinder {

    constructor(options) {
        this.headlineCharCodes = normalizedCharCodeArray(options.headline);
        this.stackedTextItems = [];
        this.stackedChars = 0;
    }

    consume(textItem) {
        const normalizedCharCodes = normalizedCharCodeArray(textItem.text);
        const matchAll = this.matchAll(normalizedCharCodes);
        if (matchAll) {
            this.stackedTextItems.push(textItem);
            this.stackedChars += normalizedCharCodes.length;
            if (this.stackedChars == this.headlineCharCodes.length) {
                return this.stackedTextItems;
            }
        } else {
            if (this.stackedChars > 0) {
                this.stackedChars = 0;
                this.stackedTextItems = [];
                this.consume(textItem); // test again without stack
            }
        }
        return null;
    }

    matchAll(normalizedCharCodes) {
        for (var i = 0; i < normalizedCharCodes.length; i++) {
            const headlineChar = this.headlineCharCodes[this.stackedChars + i];
            const textItemChar = normalizedCharCodes[i];
            if (textItemChar != headlineChar) {
                return false;
            }
        }
        return true;
    }
}

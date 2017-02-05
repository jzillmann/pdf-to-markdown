// An text item detected as markdown element
export default class MarkdownElement {

    constructor(options) {
        if (this.constructor === MarkdownElement) {
            throw new TypeError("Can not construct abstract class.");
        }
        this.newLineBefore = options.newLineBefore;
        this.newLineAfter = options.newLineAfter;
    }

    transformText(text) { // eslint-disable-line no-unused-vars
        throw new TypeError("Do not call abstract method foo from child.");
    }

}

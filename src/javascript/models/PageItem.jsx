// A abstract PageItem class, can be TextItem, or TextItemBlock
export default class PageItem {

    constructor(options) {
        if (this.constructor === PageItem) {
            throw new TypeError("Can not construct abstract class.");
        }
        this.type = options.type;
        this.annotation = options.annotation;
        this.parsedElements = options.parsedElements;
    }

}

export class ParsedElements {

    constructor(options) {
        this.footnoteLinks = options.footnoteLinks;
        this.footnotes = options.footnotes;
    }

    add(parsedElements) {
        this.footnoteLinks = this.footnoteLinks.concat(parsedElements.footnoteLinks);
        this.footnotes = this.footnotes.concat(parsedElements.footnotes);
    }

}
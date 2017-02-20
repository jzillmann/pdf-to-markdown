// A block within a PdfPage
export default class PdfBlock {

    constructor(options) {
        this.textItems = options.textItems;
        this.type = options.type;
        this.annotation = options.annotation;
        this.parsedElements = options.parsedElements;
    }

}

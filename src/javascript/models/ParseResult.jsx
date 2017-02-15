// The result of a PDF parse respectively a Transformation
export default class ParseResult {

    constructor(options) {
        this.content = options.content; // like PdfPages[]
        this.summary = options.summary; // something to show only for the transformation
        this.globals = options.globals; // properties accasable for the following transformations
    }

}

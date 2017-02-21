// The result of a PDF parse respectively a Transformation
export default class ParseResult {

    constructor(options) {
        this.content = options.content; // like PdfPages[]
        this.globals = options.globals; // properties accasable for all the following transformations in debug mode
        this.messages = options.messages; // something to show only for the transformation in debug mode
    }

}

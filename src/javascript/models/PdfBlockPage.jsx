// A page which holds TextItems grouped by block displayable via PdfPageBlockView
export default class PdfBlockPage {

    constructor(options) {
        this.index = options.index;
        this.blocks = options.blocks;
    }

}

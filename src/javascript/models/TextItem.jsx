//A text iteme, i.e. a line, within a page
export default class TextItem {

    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.text = options.text;
        this.font = options.font;
        this.fontAscent = options.fontAscent;
        this.fontDescent = options.fontDescent;
        this.annotation = options.annotation;
        this.markdownElement = options.markdownElement;
    }

}

import PageItem from './PageItem.jsx'

//A text item, i.e. a line or a word within a page
export default class TextItem extends PageItem {

    constructor(options) {
        super(options);
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.text = options.text;
        this.font = options.font;
        this.fontAscent = options.fontAscent;
        this.fontDescent = options.fontDescent;
    }

}

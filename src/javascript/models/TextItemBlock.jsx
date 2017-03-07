import PageItem from './PageItem.jsx'

// A block of TextItem[] within a Page
export default class TextItemBlock extends PageItem {

    constructor(options) {
        super(options);
        this.textItems = options.textItems;
    }

}

import PageItem from './PageItem.jsx'
import TextItem from './TextItem.jsx'

// A block of TextItem[] within a Page
export default class TextItemBlock extends PageItem {

    constructor(options) {
        super(options);
        this.textItems = [];
        if (options.textItems) {
            options.textItems.forEach(item => this.addTextItem(item));
        }
    }

    addTextItem(textItem:TextItem) {
        if (this.type && textItem.type && this.type !== textItem.type) {
            throw `Adding text item of type ${textItem.type} to block of type ${this.type}`
        }
        if (!this.type) {
            this.type = textItem.type;
        }
        if (textItem.parsedElements) {
            if (this.parsedElements) {
                this.parsedElements.add(textItem.parsedElements);
            } else {
                this.parsedElements = textItem.parsedElements;
            }
        }
        const copiedTextItem = new TextItem({
            ...textItem
        });
        copiedTextItem.type = null;
        this.textItems.push(copiedTextItem);
    }

}

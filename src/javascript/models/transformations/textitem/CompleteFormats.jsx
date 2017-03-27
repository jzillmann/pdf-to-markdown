import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import TextItem from '../../TextItem.jsx';
import { UNCHANGED_ANNOTATION, ADDED_ANNOTATION, REMOVED_ANNOTATION } from '../../Annotation.jsx';

//Complete unopened/unclosed bold/italic formats
export default class CompleteFormats extends ToTextItemTransformation {

    //TODO move to block and ignore quotes

    constructor() {
        super("Complete Bold/Italics");
    }

    transform(parseResult:ParseResult) {
        // remove line formats from headers
        parseResult.pages.forEach(page => {
            page.items.forEach(item => {
                if (item.type && item.type.headline) {
                    if (item.lineFormat || item.unopenedFormat || item.unclosedFormat) {
                        item.lineFormat = null;
                        item.unopenedFormat = null;
                        item.unclosedFormat = null;
                        item.annotation = UNCHANGED_ANNOTATION;
                    }
                }
            });
        });

        //close open formats
        parseResult.pages.forEach(page => {
            const itemStack = new ItemStack();
            page.items.forEach(item => {
                itemStack.consume(item);
            });
            page.items = itemStack.getResults();
        });
        return new ParseResult({
            ...parseResult,
            messages: []
        });

    }

}

class ItemStack {

    constructor() {
        this.openFormat;
        this.openFormatItem = [];
        this.resultItems = [];
    }

    cache(textItem, format) {
        this.openFormat = format;
        this.openFormatItem = textItem;
    }

    closeOpenFormat() {
        if (this.openFormat) {
            this.openFormatItem.annotation = REMOVED_ANNOTATION;
            this.writeToResults(textItemWithClosing(this.openFormatItem, this.openFormat));
            this.clear();
        }
    }

    clear() {
        this.openFormat = null;
        this.openFormatItem = null;
    }

    writeToResults(textItem) {
        this.resultItems.push(textItem);
    }


    getResults() {
        if (this.openFormat) {
            this.closeOpenFormat();
        }
        return this.resultItems;
    }

    consume(item) {
        var newItem;

        const handleFreshUnopened = () => {
            item.annotation = REMOVED_ANNOTATION;
            newItem = textItemWithOpening(item, item.unopenedFormat);
        }

        const handleFreshLine = () => {
            item.annotation = REMOVED_ANNOTATION;
            newItem = textItemWithOpening(item, item.lineFormat);
            this.cache(newItem, item.lineFormat);
        }

        const handleFreshUnclosed = () => {
            if (newItem) {
                this.cache(newItem, item.unclosedFormat);
                newItem = null;
            } else {
                this.cache(item, item.unclosedFormat);
            }
        }

        //flush  open format if possible
        if (this.openFormat) {
            if (item.unopenedFormat) {
                if (item.unopenedFormat === this.openFormat) {
                    //good, closing an opened
                    this.clear();
                } else {
                    this.closeOpenFormat();
                    handleFreshUnopened();
                }
            }

            if (item.lineFormat) {
                if (item.lineFormat === this.openFormat) {
                    this.cache(item, item.lineFormat);
                } else {
                    this.closeOpenFormat();
                    handleFreshLine();
                }
            }

            if (item.unclosedFormat) {
                this.closeOpenFormat();
                handleFreshUnclosed();
            }

            if (!item.unopenedFormat && !item.lineFormat && !item.unclosedFormat) {
                this.closeOpenFormat();
            }

        } else { // handle fresh items
            if (item.unopenedFormat) {
                handleFreshUnopened()
            }
            if (item.lineFormat) {
                handleFreshLine();
            }
            if (item.unclosedFormat) {
                handleFreshUnclosed();
            }
        }

        this.writeToResults(item);
        if (newItem) {
            this.writeToResults(newItem);
        }
    }
}

function textItemWithOpening(textItem, format) {
    return new TextItem({
        ...textItem,
        text: format.startSymbol + textItem.text,
        annotation: ADDED_ANNOTATION
    });
}

function textItemWithClosing(textItem, format) {
    return new TextItem({
        ...textItem,
        text: textItem.text + format.endSymbol,
        annotation: ADDED_ANNOTATION
    });
}

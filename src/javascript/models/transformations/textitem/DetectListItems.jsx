import ToLineItemTransformation from '../ToLineItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import LineItem from '../../LineItem.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION, DETECTED_ANNOTATION } from '../../Annotation.jsx';
import ElementType from '../../ElementType.jsx';
import { isListItem, isNumberedListItem, removeLeadingWhitespaces } from '../../../functions.jsx';

//Detect items starting with -, •, etc...
export default class DetectListItems extends ToLineItemTransformation {

    constructor() {
        super("Detect List Items");
    }

    transform(parseResult:ParseResult) {
        var foundListItems = 0;
        var foundNumberedItems = 0;
        parseResult.pages.forEach(page => {
            const newItems = [];
            page.items.forEach(item => {
                newItems.push(item);
                if (!item.type) {
                    var text = item.text();
                    if (isListItem(text)) {
                        foundListItems++
                        const textWithDash = '-' + removeLeadingWhitespaces(text).substring(1, text.length);
                        if (textWithDash === text) {
                            item.annotation = DETECTED_ANNOTATION;
                            item.type = ElementType.LIST;
                        } else {
                            item.annotation = REMOVED_ANNOTATION;
                            newItems.push(new LineItem({
                                ...item,
                                text: textWithDash,
                                annotation: ADDED_ANNOTATION,
                                type: ElementType.LIST
                            }));
                        }
                    } else if (isNumberedListItem(text)) { //TODO check that starts with 1 (kala chakra)
                        foundNumberedItems++;
                        item.annotation = DETECTED_ANNOTATION;
                        item.type = ElementType.LIST;
                    }
                }
            });
            page.items = newItems;
        });

        return new ParseResult({
            ...parseResult,
            messages: [
                'Detected ' + foundListItems + ' plain list items.',
                'Detected ' + foundNumberedItems + ' numbered list items.'
            ]
        });

    }

}

import ToTextItemTransformation from './ToTextItemTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItem from '../TextItem.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION, DETECTED_ANNOTATION } from '../Annotation.jsx';
import ElementType from '../ElementType.jsx';
import { isListItem, isNumberedListItem, removeLeadingWhitespaces } from '../../functions.jsx';

//Detect items starting with -, •, etc...
export default class DetectListItems extends ToTextItemTransformation {

    constructor() {
        super("Detect List Items");
    }

    transform(parseResult:ParseResult) {
        var foundListItems = 0;
        var foundNumberedItems = 0;
        parseResult.pages.forEach(page => {
            const newTextItems = [];
            page.items.forEach(textItem => {
                newTextItems.push(textItem);
                if (!textItem.type) {
                    var text = textItem.text;
                    if (isListItem(text)) {
                        foundListItems++
                        const textWithDash = '-' + removeLeadingWhitespaces(text).substring(1, text.length);
                        if (textWithDash === text) {
                            textItem.annotation = DETECTED_ANNOTATION;
                            textItem.type = ElementType.LIST;
                        } else {
                            textItem.annotation = REMOVED_ANNOTATION;
                            newTextItems.push(new TextItem({
                                ...textItem,
                                text: textWithDash,
                                annotation: ADDED_ANNOTATION,
                                type: ElementType.LIST
                            }));
                        }
                    } else if (isNumberedListItem(text)) {
                        foundNumberedItems++;
                        textItem.annotation = DETECTED_ANNOTATION;
                        textItem.type = ElementType.LIST;
                    }
                }
            });
            page.items = newTextItems;
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

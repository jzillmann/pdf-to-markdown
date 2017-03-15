import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import TextItem from '../../TextItem.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION, DETECTED_ANNOTATION } from '../../Annotation.jsx';
import ElementType from '../../ElementType.jsx';
import { isHeadline, headlineByLevel } from '../../ElementType.jsx';
import { isListItem, isNumberedListItem, removeLeadingWhitespaces } from '../../../functions.jsx';

//Detect items starting with -, •, etc...
export default class DetectListItems extends ToTextItemTransformation {

    constructor() {
        super("Detect Headers");
    }

    transform(parseResult:ParseResult) {
        // analyse existing headers from TOC detection
        const headlineTypeToHeightRange = {}; //H1={min:23, max:25}
        parseResult.pages.forEach(page => {
            page.items.forEach(textItem => {
                if (isHeadline(textItem.type)) {
                    var range = headlineTypeToHeightRange[textItem.type];
                    if (range) {
                        range.min = Math.min(range.min, textItem.height);
                        range.max = Math.max(range.max, textItem.height);
                    } else {
                        range = {
                            min: textItem.height,
                            max: textItem.height
                        };
                        headlineTypeToHeightRange[textItem.type] = range;
                    }
                }
            });
        });

        const existingHeadlineTypes = Object.keys(headlineTypeToHeightRange);
        if (existingHeadlineTypes.length > 0) {

        }


        var foundListItems = 0;
        var foundNumberedItems = 0;
        // parseResult.pages.forEach(page => {
        //     const newTextItems = [];
        //     page.items.forEach(textItem => {
        //         newTextItems.push(textItem);
        //         if (!textItem.type) {
        //             var text = textItem.text;
        //             if (isListItem(text)) {
        //                 foundListItems++
        //                 const textWithDash = '-' + removeLeadingWhitespaces(text).substring(1, text.length);
        //                 if (textWithDash === text) {
        //                     textItem.annotation = DETECTED_ANNOTATION;
        //                     textItem.type = ElementType.LIST;
        //                 } else {
        //                     textItem.annotation = REMOVED_ANNOTATION;
        //                     newTextItems.push(new TextItem({
        //                         ...textItem,
        //                         text: textWithDash,
        //                         annotation: ADDED_ANNOTATION,
        //                         type: ElementType.LIST
        //                     }));
        //                 }
        //             } else if (isNumberedListItem(text)) {
        //                 foundNumberedItems++;
        //                 textItem.annotation = DETECTED_ANNOTATION;
        //                 textItem.type = ElementType.LIST;
        //             }
        //         }
        //     });
        //     page.items = newTextItems;
        // });

        return new ParseResult({
            ...parseResult,
            messages: [
                'Existing headline heights: ' + JSON.stringify(headlineTypeToHeightRange),
                'Detected ' + foundNumberedItems + ' numbered list items.'
            ]
        });

    }

}

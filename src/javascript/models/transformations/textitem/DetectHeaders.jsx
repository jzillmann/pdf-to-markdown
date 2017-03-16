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
        const {tocPages, headlineTypeToHeightRange, mostUsedHeight} = parseResult.globals;

        var detectedHeaders = 0;

        if (tocPages.length > 0) {

            //apply existing headline heights to find additional headlines
            const headlineTypes = Object.keys(headlineTypeToHeightRange);
            headlineTypes.forEach(headlineType => {
                var range = headlineTypeToHeightRange[headlineType];
                // if (range.min > mostUsedHeight && range.max - range.min <= 1) { //use only very clear headlines
                if (range.max > mostUsedHeight) { //use only very clear headlines, only use max
                    parseResult.pages.forEach(page => {
                        page.items.forEach(textItem => {
                            if (!textItem.type && textItem.height == range.max) {
                                textItem.annotation = DETECTED_ANNOTATION;
                                textItem.type = ElementType.enumValueOf(headlineType);
                                detectedHeaders++
                            }
                        });
                    });
                }

            });
        }

        return new ParseResult({
            ...parseResult,
            messages: [
                'Existing headline heights: ' + JSON.stringify(headlineTypeToHeightRange),
                'Detected ' + detectedHeaders + ' headlines.'
            ]
        });

    }

}

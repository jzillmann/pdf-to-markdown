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
        const {tocPages, headlineTypeToHeightRange, mostUsedHeight, maxHeight} = parseResult.globals;

        var detectedHeaders = 0;

        if (tocPages.length > 0) {

            //Use existing headline heights to find additional headlines
            const headlineTypes = Object.keys(headlineTypeToHeightRange);
            headlineTypes.forEach(headlineType => {
                var range = headlineTypeToHeightRange[headlineType];
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

        // Handle title pages
        const pagesWithMaxHeight = findPagesWithMaxHeight(parseResult.pages, maxHeight);
        const min2ndLevelHeaderHeigthOnMaxPage = mostUsedHeight + ((maxHeight - mostUsedHeight) / 4);
        pagesWithMaxHeight.forEach(titlePage => {
            titlePage.items.forEach(textItem => {
                const height = textItem.height;
                if (!textItem.type && height > min2ndLevelHeaderHeigthOnMaxPage) {
                    if (height == maxHeight) {
                        textItem.type = ElementType.H1;
                    } else {
                        textItem.type = ElementType.H2;
                    }
                    textItem.annotation = DETECTED_ANNOTATION;
                    detectedHeaders++;
                }
            });
        });

        return new ParseResult({
            ...parseResult,
            messages: [
                'Existing headline heights: ' + JSON.stringify(headlineTypeToHeightRange),
                'Detected ' + detectedHeaders + ' headlines.'
            ]
        });

    }

}

function findPagesWithMaxHeight(pages, maxHeight) {
    const maxHeaderPagesSet = new Set();
    pages.forEach(page => {
        page.items.forEach(textItem => {
            if (!textItem.type && textItem.height == maxHeight) {
                maxHeaderPagesSet.add(page);
            }
        });
    });
    return maxHeaderPagesSet;
}


import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import { DETECTED_ANNOTATION } from '../../Annotation.jsx';
import ElementType from '../../ElementType.jsx';
import { headlineByLevel } from '../../ElementType.jsx';

//Detect items starting with -, •, etc...
export default class DetectHeaders extends ToTextItemTransformation {

    constructor() {
        super("Detect Headers");
    }

    transform(parseResult:ParseResult) {
        const {tocPages, headlineTypeToHeightRange, mostUsedHeight, mostUsedDistance, mostUsedFont, maxHeight} = parseResult.globals;
        const hasToc = tocPages.length > 0;
        var detectedHeaders = 0;

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

        if (hasToc) { //Use existing headline heights to find additional headlines
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
        } else { //Categorize headlines by the text heights
            const heights = [];
            var lastHeight;
            parseResult.pages.forEach(page => {
                page.items.forEach(textItem => {
                    if (!textItem.type && textItem.height > mostUsedHeight) {
                        if (!heights.includes(textItem.height) && (!lastHeight || lastHeight > textItem.height)) {
                            heights.push(textItem.height);
                        }
                    }
                });
            });
            heights.sort((a, b) => b - a);

            heights.forEach((height, i) => {
                const headlineType = headlineByLevel(2 + i);
                parseResult.pages.forEach(page => {
                    page.items.forEach(textItem => {
                        if (!textItem.type && textItem.height == height) {
                            detectedHeaders++;
                            textItem.annotation = DETECTED_ANNOTATION;
                            textItem.type = headlineType;
                        }
                    });
                });
            });
        }

        //find headlines which have paragraph height
        var smallesHeadlineLevel = 1;
        parseResult.pages.forEach(page => {
            page.items.forEach(textItem => {
                if (textItem.type && textItem.type.headline) {
                    smallesHeadlineLevel = Math.max(smallesHeadlineLevel, textItem.type.headlineLevel);
                }
            });
        });
        if (smallesHeadlineLevel < 6) {
            const nextHeadlineType = headlineByLevel(smallesHeadlineLevel + 1);
            parseResult.pages.forEach(page => {
                var lastItem;
                page.items.forEach(textItem => {
                    if (!textItem.type
                            && textItem.height == mostUsedHeight
                            && textItem.font !== mostUsedFont
                            && (!lastItem || lastItem.y < textItem.y || (lastItem.type && lastItem.type.headline) || (lastItem.y - textItem.y > mostUsedDistance * 2))
                            && textItem.text === textItem.text.toUpperCase()
                    ) {
                        detectedHeaders++;
                        textItem.annotation = DETECTED_ANNOTATION;
                        textItem.type = nextHeadlineType;
                    }
                    lastItem = textItem;
                });
            });
        }


        return new ParseResult({
            ...parseResult,
            messages: [
                'Detected ' + detectedHeaders + ' headlines.',
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


import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItem from '../TextItem.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../Annotation.jsx';

// Converts vertical text to horizontal
export default class VerticalToHorizontal extends ToPdfViewTransformation {

    constructor() {
        super("Vertical to Horizontal Text");
    }

    transform(parseResult:ParseResult) {
        const newContent = parseResult.content.map(page => {
            const newTextItems = [];
            // var oneCharacterItems = [];

            // const applyTransformation = () => {
            //     oneCharacterItems.forEach(item => {
            //         item.annotation = REMOVED_ANNOTATION;
            //         newTextItems.push(item);
            //     //TODO add new
            //     });
            //     oneCharacterItems = [];
            // };
            // const rollbackTransformation = () => {
            //     oneCharacterItems.forEach(item => {
            //         newTextItems.push(item);
            //     });
            //     oneCharacterItems = [];
            // };

            //TODO generic state machine code ?

            page.textItems.reduce((oneCharacterItems, item) => {
                if (item.text.trim().length == 1) {
                    if (oneCharacterItems.length == 0) {
                        oneCharacterItems.push(item);
                    } else {
                        const lastItem = oneCharacterItems[oneCharacterItems.length - 1];
                        if (lastItem.y - item.y > 5 && lastItem.font === item.font) {
                            oneCharacterItems.push(item);
                        } else {
                            if (oneCharacterItems.length > 5) {
                                var combinedText = '';
                                var minX = 999;
                                var maxY = 0;
                                var sumWidth = 0;
                                var maxHeight = 0;
                                oneCharacterItems.forEach(oneCharacterItem => {
                                    oneCharacterItem.annotation = REMOVED_ANNOTATION;
                                    newTextItems.push(oneCharacterItem);
                                    combinedText += oneCharacterItem.text.trim();
                                    minX = Math.min(minX, oneCharacterItem.x);
                                    maxY = Math.max(maxY, oneCharacterItem.y);
                                    sumWidth += oneCharacterItem.width;
                                    maxHeight = Math.max(maxHeight, oneCharacterItem.height);
                                });
                                newTextItems.push(new TextItem({
                                    ...oneCharacterItems[0],
                                    x: minX,
                                    y: maxY,
                                    width: sumWidth,
                                    height: maxHeight,
                                    text: combinedText,
                                    annotation: ADDED_ANNOTATION
                                }));
                            } else {
                                oneCharacterItems.forEach(oneCharacterItem => newTextItems.push(oneCharacterItem));
                            }
                            oneCharacterItems = [item];
                        }
                    }
                } else {
                    oneCharacterItems.forEach(oneCharacterItem => newTextItems.push(oneCharacterItem));
                    oneCharacterItems = [];
                    newTextItems.push(item);
                }
                return oneCharacterItems;
            }, []);

            return {
                ...page,
                textItems: newTextItems
            };
        });
        return new ParseResult({
            ...parseResult,
            content: newContent,
        });
    }

    completeTransform(parseResult:ParseResult) {
        parseResult.content.forEach(page => {
            page.textItems = page.textItems.filter(textItem => !textItem.annotation || textItem.annotation !== REMOVED_ANNOTATION);
            page.textItems.forEach(textItem => textItem.annotation = null)
        });
        return parseResult;
    }

}

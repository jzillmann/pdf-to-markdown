import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import TextItem from '../../TextItem.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../../Annotation.jsx';

// Converts vertical text to horizontal
export default class VerticalToHorizontal extends ToTextItemTransformation {

    constructor() {
        super("Vertical to Horizontal Text");
    }

    transform(parseResult:ParseResult) {
        var foundVerticals = 0;
        const newPages = parseResult.pages.map(page => {
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

            const leftOver = page.items.reduce((oneCharacterItems, item) => {
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
                                foundVerticals++;
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
            leftOver.forEach(oneCharacterItem => newTextItems.push(oneCharacterItem));

            return {
                ...page,
                items: newTextItems
            };
        });
        return new ParseResult({
            ...parseResult,
            pages: newPages,
            messages: ["Converted " + foundVerticals + " verticals"]
        });
    }


}

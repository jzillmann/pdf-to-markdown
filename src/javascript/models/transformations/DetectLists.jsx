import ToTextItemBlockTransformation from './ToTextItemBlockTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItem from '../TextItem.jsx';
import TextItemBlock from '../TextItemBlock.jsx';
import TextItemCombiner from '../TextItemCombiner.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../Annotation.jsx';
import ElementType from '../ElementType.jsx';
import { minXFromBlocks } from '../../textItemFunctions.jsx';

//Detect quotes, code etc.. which is transformed to markdown code syntax
export default class DetectLists extends ToTextItemBlockTransformation {

    constructor() {
        super("Detect Lists");
    }

    transform(parseResult:ParseResult) {
        const {mostUsedDistance} = parseResult.globals;
        var foundBlocks = 0;
        const textCombiner = new TextItemCombiner({
            mostUsedDistance: mostUsedDistance
        });

        parseResult.pages.forEach(page => {
            var minX = minXFromBlocks(page.items);
            if (minX) {
                const newBlocks = [];
                page.items.forEach(block => {
                    newBlocks.push(block);
                    if (!block.type) {
                        const combineResult = textCombiner.combine(block.textItems);
                        if (hasMoreThan2LineItems(combineResult.textItems)) {
                            block.annotation = REMOVED_ANNOTATION;
                            foundBlocks++;

                            var lastItemX;
                            var currentLevel = 0;
                            var xByLevel = {};
                            var itemsBeforeFirstLineItem = [];
                            var listBlockItems = [];

                            const pushLineItem = (originalItem, text, setLevel) => {
                                if (lastItemX && setLevel) {
                                    if (originalItem.x > lastItemX) {
                                        currentLevel++;
                                        xByLevel[originalItem.x] = currentLevel;
                                    } else if (originalItem.x < lastItemX) {
                                        currentLevel = xByLevel[originalItem.x];
                                    }
                                } else {
                                    xByLevel[originalItem.x] = 0;
                                }


                                listBlockItems.push(new TextItem({
                                    ...originalItem,
                                    text: ' '.repeat(currentLevel * 3) + text
                                }));
                                lastItemX = originalItem.x;

                            };

                            combineResult.textItems.forEach(lineItem => {
                                if (isPlainListItem(lineItem.text)) {
                                    var text = lineItem.text;
                                    text = text.substring(1, text.length).trim();
                                    text = '- ' + text;
                                    pushLineItem(lineItem, text, true);

                                } else if (isNumberedListItem(lineItem.text)) {
                                    var numberedText = lineItem.text;
                                    numberedText
                                    pushLineItem(lineItem, numberedText, true);
                                } else {
                                    if (lastItemX) {
                                        pushLineItem(lineItem, lineItem.text, false);
                                    } else {
                                        itemsBeforeFirstLineItem.push(lineItem);
                                    }
                                }
                            });

                            if (itemsBeforeFirstLineItem.length > 0) {
                                newBlocks.push(new TextItemBlock({
                                    textItems: itemsBeforeFirstLineItem,
                                    type: ElementType.PARAGRAPH,
                                    annotation: ADDED_ANNOTATION
                                }));
                            }
                            //TODO display with whitespace pre support
                            newBlocks.push(new TextItemBlock({
                                textItems: listBlockItems,
                                type: ElementType.LIST,
                                annotation: ADDED_ANNOTATION,
                                parsedElements: combineResult.parsedElements
                            }));
                        }
                    }
                });
                page.items = newBlocks;
            }
        });

        return new ParseResult({
            ...parseResult,
            messages: ['Detected ' + foundBlocks + ' list blocks.']
        });

    }

}

function hasMoreThan2LineItems(textItems:TextItem[]) {
    var numberOfListItemLineStarts = 0;
    for ( let item of textItems ) {
        if (isPlainListItem(item.text) || isNumberedListItem(item.text)) {
            numberOfListItemLineStarts++;
            if (numberOfListItemLineStarts == 2) {
                return true;
            }
        }
    }
    return false;
}

function isPlainListItem(string) {
    if (string.startsWith('-')) {
        return true;
    }
    if (string.startsWith('•')) {
        return true;
    }
    return false;
}

function isNumberedListItem(string) {
    if (!isNaN(parseInt(string.charAt(0)))) {
        return true;
    }
    return false;
}


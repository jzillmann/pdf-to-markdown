import ToTextItemBlockTransformation from './ToTextItemBlockTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import { MODIFIED_ANNOTATION, UNCHANGED_ANNOTATION } from '../Annotation.jsx';
import ElementType from '../ElementType.jsx';

// Cares for proper sub-item spacing/leveling
export default class DetectListLevels extends ToTextItemBlockTransformation {

    constructor() {
        super("Level Lists");
        this.showWhitespaces = true;
    }

    transform(parseResult:ParseResult) {
        var listBlocks = 0;
        var modifiedBlocks = 0;
        parseResult.pages.forEach(page => {

            page.items.filter(block => block.type === ElementType.LIST).forEach(listBlock => {
                var lastItemX;
                var currentLevel = 0;
                const xByLevel = {};
                var modifiedBlock = false;
                listBlock.textItems.forEach(textItem => {
                    const isListItem = true;
                    if (lastItemX && isListItem) {
                        if (textItem.x > lastItemX) {
                            currentLevel++;
                            xByLevel[textItem.x] = currentLevel;
                        } else if (textItem.x < lastItemX) {
                            currentLevel = xByLevel[textItem.x];
                        }
                    } else {
                        xByLevel[textItem.x] = 0;
                    }
                    if (currentLevel > 0) {
                        textItem.text = ' '.repeat(currentLevel * 3) + textItem.text;
                        modifiedBlock = true;
                    }
                    lastItemX = textItem.x;
                });
                listBlocks++;
                if (modifiedBlock) {
                    modifiedBlocks++;
                    listBlock.annotation = MODIFIED_ANNOTATION;
                } else {
                    listBlock.annotation = UNCHANGED_ANNOTATION;
                }
            });

        });
        return new ParseResult({
            ...parseResult,
            messages: ['Modified ' + modifiedBlocks + ' / ' + listBlocks + ' list blocks.']
        });

    }
}

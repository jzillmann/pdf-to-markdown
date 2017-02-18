import TextItem from './TextItem.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from './Annotation.jsx';

//Combines text items which are on the same Y at the same time doing inline transformations like 'whitespace removal', bold/emphasis annotation, link-detection, etc..
export default class TextItemCombiner {

    constructor(options) {
        this.transformEmphasis = options.transformEmphasis || true;
        console.debug(this.transformEmphasis);
    }

    // returns a TextItem array new items
    combine(textItems: TextItem[]) {
        const resultItems = [];
        const groupedItems = groupByFollowingY(textItems);
        groupedItems.forEach(itemGroup => {
            if (itemGroup.length == 1) {
                resultItems.push(itemGroup[0]);
            } else {
                var text = '';
                itemGroup.forEach(item => {
                    // item.annotation = REMOVED_ANNOTATION;
                    // resultItems.push(item);
                    text += item.text;
                });
                //TODO set other elements
                resultItems.push(new TextItem({
                    text: text,
                }));
            }
        });

        //TODO whitespace removal
        //TODO bold/emphasis

        return resultItems;
    }

}

function groupByFollowingY(textItems) {
    const yArrays = [];
    var itemsWithSameY = [];
    var lastItem;
    textItems.forEach(item => {
        if (itemsWithSameY.length == 0 || item.y == lastItem.y) {
            itemsWithSameY.push(item);
        } else {
            yArrays.push(itemsWithSameY);
            itemsWithSameY = [item];
        }
        lastItem = item;
    })
    yArrays.push(itemsWithSameY);
    return yArrays;
}

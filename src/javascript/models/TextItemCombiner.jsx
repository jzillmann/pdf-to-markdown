import TextItem from './TextItem.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from './Annotation.jsx';

//Combines text items which are on the same Y at the same time doing inline transformations like 'whitespace removal', bold/emphasis annotation, link-detection, etc..
export default class TextItemCombiner {

    constructor(options) {
        this.transformEmphasis = options.transformEmphasis || true;
        this.maxYDerivation = options.transformEmphasis || 3;
    }

    // returns a TextItem array new items
    combine(textItems: TextItem[]) {
        const resultItems = [];
        const groupedItems = this.groupByFollowingY(textItems);
        groupedItems.forEach(itemGroup => {
            if (itemGroup.length == 1) {
                resultItems.push(itemGroup[0]);
            } else {
                var text = '';
                var maxHeight = 0;
                var widthSum = 0;
                itemGroup.forEach(item => {
                    // item.annotation = REMOVED_ANNOTATION;
                    // resultItems.push(item);
                    text += item.text;
                    widthSum += item.width;
                });
                //TODO set other elements
                resultItems.push(new TextItem({
                    ...itemGroup[0],
                    text: text,
                    height: maxHeight,
                    width: widthSum,
                }));
            }
        });

        //TODO whitespace removal
        //TODO bold/emphasis

        return resultItems;
    }

    groupByFollowingY(textItems) {
        const yArrays = [];
        var itemsWithSameY = [];
        var lastItem;
        textItems.forEach(item => {
            if (itemsWithSameY.length == 0 || Math.abs(lastItem.y - item.y) <= this.maxYDerivation) {
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
}

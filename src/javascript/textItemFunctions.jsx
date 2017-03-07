import TextItemBlock from './models/TextItemBlock.jsx';
import TextItem from './models/TextItem.jsx';

export function minXFromBlocks(blocks:TextItemBlock[]) {
    var minX = 999;
    blocks.forEach(block => {
        block.textItems.forEach(item => {
            minX = Math.min(minX, item.x)
        });
    });
    if (minX == 999) {
        return null;
    }
    return minX;
}

export function minXFromTextItems(items:TextItem) {
    var minX = 999;
    items.forEach(item => {
        minX = Math.min(minX, item.x)
    });
    if (minX == 999) {
        return null;
    }
    return minX;
}

export function sortByX(items:TextItem) {
    items.sort((a, b) => {
        return a.x - b.x;
    });
}

export function sortCopyByX(items:TextItem) {
    const copy = items.concat();
    sortByX(copy);
    return copy;
}
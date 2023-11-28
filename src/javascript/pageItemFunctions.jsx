import PageItem from './models/PageItem.jsx';

export function minXFromBlocks(blocks) {
    var minX = 999;
    blocks.forEach(block => {
        block.items.forEach(item => {
            minX = Math.min(minX, item.x)
        });
    });
    if (minX == 999) {
        return null;
    }
    return minX;
}

export function minXFromPageItems(items) {
    var minX = 999;
    items.forEach(item => {
        minX = Math.min(minX, item.x)
    });
    if (minX == 999) {
        return null;
    }
    return minX;
}

export function sortByX(items) {
    items.sort((a, b) => {
        return a.x - b.x;
    });
}

export function sortCopyByX(items) {
    const copy = items.concat();
    sortByX(copy);
    return copy;
}
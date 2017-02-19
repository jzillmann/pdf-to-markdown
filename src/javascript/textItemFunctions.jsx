import PdfBlock from './models/PdfBlock.jsx';
import TextItem from './models/TextItem.jsx';

export function minXFromBlocks(blocks:PdfBlock[]) {
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

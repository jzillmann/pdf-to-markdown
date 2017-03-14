import { Enum } from 'enumify';
import TextItem from './TextItem.jsx';
import TextItemBlock from './TextItemBlock.jsx';

export default class ElementType extends Enum {
}

ElementType.initEnum({
    H1: {
        toText(block:TextItemBlock) {
            return '# ' + concatTextItems(block.textItems);
        }
    },
    H2: {
        toText(block:TextItemBlock) {
            return '## ' + concatTextItems(block.textItems);
        }
    },
    H3: {
        toText(block:TextItemBlock) {
            return '### ' + concatTextItems(block.textItems);
        }
    },
    H4: {
        toText(block:TextItemBlock) {
            return '#### ' + concatTextItems(block.textItems);
        }
    },
    H5: {
        toText(block:TextItemBlock) {
            return '##### ' + concatTextItems(block.textItems);
        }
    },
    H6: {
        toText(block:TextItemBlock) {
            return '###### ' + concatTextItems(block.textItems);
        }
    },
    TOC: {
        mergeToBlock: true,
        toText(block:TextItemBlock) {
            return concatTextItems(block.textItems);
        }
    },
    FOOTNOTES: {
        mergeToBlock: true,
        mergeFollowingNonTypedItems: true,
        toText(block:TextItemBlock) {
            return concatTextItems(block.textItems);
        }
    },
    CODE: {
        mergeToBlock: true,
        toText(block:TextItemBlock) {
            return '```\n' + concatTextItems(block.textItems) + '```'
        }
    },
    LIST: {
        mergeToBlock: true,
        mergeFollowingNonTypedItemsWithSmallDistance: true,
        toText(block:TextItemBlock) {
            return concatTextItems(block.textItems);
        }
    },
    PARAGRAPH: {
        toText(block:TextItemBlock) {
            return concatTextItems(block.textItems);
        }
    }
});

export function blockToText(block: TextItemBlock) {
    if (!block.type) {
        return concatTextItems(block.textItems);
    }
    return block.type.toText(block);
}

function concatTextItems(textItems: TextItem[]) {
    var text = '';
    textItems.forEach(item => {
        text += item.text + '\n';
    });
    return text;
}

export function headlineByLevel(level) {
    if (level == 1) {
        return ElementType.H1;
    } else if (level == 2) {
        return ElementType.H2;
    } else if (level == 3) {
        return ElementType.H3;
    } else if (level == 4) {
        return ElementType.H4;
    } else if (level == 5) {
        return ElementType.H5;
    } else if (level == 6) {
        return ElementType.H6;
    }
    throw "Unsupported headline level: " + level + " (supported are 1-6)";
}
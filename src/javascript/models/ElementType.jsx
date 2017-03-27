import { Enum } from 'enumify';
import LineItem from './LineItem.jsx';
import LineItemBlock from './LineItemBlock.jsx';

// An Markdown element
export default class ElementType extends Enum {
}

//TODO rename to BlockType

ElementType.initEnum({
    H1: {
        headline: true,
        headlineLevel: 1,
        toText(block:LineItemBlock) {
            return '# ' + concatLineItems(block.items);
        }
    },
    H2: {
        headline: true,
        headlineLevel: 2,
        toText(block:LineItemBlock) {
            return '## ' + concatLineItems(block.items);
        }
    },
    H3: {
        headline: true,
        headlineLevel: 3,
        toText(block:LineItemBlock) {
            return '### ' + concatLineItems(block.items);
        }
    },
    H4: {
        headline: true,
        headlineLevel: 4,
        toText(block:LineItemBlock) {
            return '#### ' + concatLineItems(block.items);
        }
    },
    H5: {
        headline: true,
        headlineLevel: 5,
        toText(block:LineItemBlock) {
            return '##### ' + concatLineItems(block.items);
        }
    },
    H6: {
        headline: true,
        headlineLevel: 6,
        toText(block:LineItemBlock) {
            return '###### ' + concatLineItems(block.items);
        }
    },
    TOC: {
        mergeToBlock: true,
        toText(block:LineItemBlock) {
            return concatLineItems(block.items);
        }
    },
    FOOTNOTES: {
        mergeToBlock: true,
        mergeFollowingNonTypedItems: true,
        toText(block:LineItemBlock) {
            return concatLineItems(block.items);
        }
    },
    CODE: {
        mergeToBlock: true,
        toText(block:LineItemBlock) {
            return '```\n' + concatLineItems(block.items) + '```'
        }
    },
    LIST: {
        mergeToBlock: true,
        mergeFollowingNonTypedItemsWithSmallDistance: true,
        toText(block:LineItemBlock) {
            return concatLineItems(block.items);
        }
    },
    PARAGRAPH: {
        toText(block:LineItemBlock) {
            return concatLineItems(block.items);
        }
    }
});

export function isHeadline(elementType: ElementType) {
    return elementType && elementType.name.length == 2 && elementType.name[0] === 'H'
}

export function blockToText(block: LineItemBlock) {
    if (!block.type) {
        return concatLineItems(block.items);
    }
    return block.type.toText(block);
}

function concatLineItems(lineItems: LineItem[]) {
    var text = '';
    lineItems.forEach(item => {
        text += item.text() + '\n';
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
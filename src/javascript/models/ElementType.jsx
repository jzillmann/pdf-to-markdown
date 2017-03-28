import { Enum } from 'enumify';
import { linesToText } from './markdown/WordType.jsx';
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
            return '# ' + linesToText(block.items, true);
        }
    },
    H2: {
        headline: true,
        headlineLevel: 2,
        toText(block:LineItemBlock) {
            return '## ' + linesToText(block.items, true);
        }
    },
    H3: {
        headline: true,
        headlineLevel: 3,
        toText(block:LineItemBlock) {
            return '### ' + linesToText(block.items, true);
        }
    },
    H4: {
        headline: true,
        headlineLevel: 4,
        toText(block:LineItemBlock) {
            return '#### ' + linesToText(block.items, true);
        }
    },
    H5: {
        headline: true,
        headlineLevel: 5,
        toText(block:LineItemBlock) {
            return '##### ' + linesToText(block.items, true);
        }
    },
    H6: {
        headline: true,
        headlineLevel: 6,
        toText(block:LineItemBlock) {
            return '###### ' + linesToText(block.items, true);
        }
    },
    TOC: {
        mergeToBlock: true,
        toText(block:LineItemBlock) {
            return linesToText(block.items, true);
        }
    },
    FOOTNOTES: {
        mergeToBlock: true,
        mergeFollowingNonTypedItems: true,
        toText(block:LineItemBlock) {
            return linesToText(block.items, false);
        }
    },
    CODE: {
        mergeToBlock: true,
        toText(block:LineItemBlock) {
            return '```\n' + linesToText(block.items, true) + '```'
        }
    },
    LIST: {
        mergeToBlock: true,
        mergeFollowingNonTypedItemsWithSmallDistance: true,
        toText(block:LineItemBlock) {
            return linesToText(block.items, false);
        }
    },
    PARAGRAPH: {
        toText(block:LineItemBlock) {
            return linesToText(block.items, false);
        }
    }
});

export function isHeadline(elementType: ElementType) {
    return elementType && elementType.name.length == 2 && elementType.name[0] === 'H'
}

export function blockToText(block: LineItemBlock) {
    if (!block.type) {
        return linesToText(block.items, false);
    }
    return block.type.toText(block);
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
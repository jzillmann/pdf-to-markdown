import { Enum } from 'enumify';

export default class ElementType extends Enum {
}

ElementType.initEnum({
    H1: {

    },
    H2: {

    },
    H3: {

    },
    H4: {

    },
    H5: {

    },
    H6: {

    },
    TOC: {
        mergeToBlock: true
    },
    FOOTNOTES: {
        mergeToBlock: true,
        mergeFollowingNonTypedItems: true
    }
});

//export default ElementType

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
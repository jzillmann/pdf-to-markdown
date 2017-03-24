import { Enum } from 'enumify';

export default class StringFormat extends Enum {
}

StringFormat.initEnum({
    STANDARD: {
        needFormat: false
    },
    BOLD: {
        needFormat: true,
        startSymbol: '**',
        endSymbol: '**'
    },
    OBLIQUE: {
        needFormat: true,
        startSymbol: '_',
        endSymbol: '_'
    },
    BOLD_OBLIQUE: {
        needFormat: true,
        startSymbol: '**_',
        endSymbol: '_**'
    }
})
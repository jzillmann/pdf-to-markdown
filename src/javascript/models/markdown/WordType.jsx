import { Enum } from 'enumify';

// An Markdown word element
export default class WordType extends Enum {

}

WordType.initEnum({
    LINK: {
        toText(string) {
            return `[${string}](${string})`
        }
    },
    FOOTNOTE_LINK: {
        attachWithoutWhitespace: true,
        plainTextFormat: true,
        toText(string) {
            return `^${string}`
        // return `<sup>[${string}](#${string})</sup>`;
        }
    },
    FOOTNOTE: {
        toText(string) {
            return `(^${string})`
        }
    },
    BOLD: {
        format: true,
        startSymbol: '**',
        endSymbol: '**',
    },
    OBLIQUE: {
        format: true,
        startSymbol: '_',
        endSymbol: '_',
    },
    BOLD_OBLIQUE: {
        format: true,
        startSymbol: '**_',
        endSymbol: '_**',
    }
});

export function linesToText(lineItems, disableInlineFormats) {
    var text = '';
    var openFormat;

    const closeFormat = () => {
        text += openFormat.endSymbol;
        openFormat = null;
    };

    lineItems.forEach((line, lineIndex) => {
        line.words.forEach((word, i) => {
            const wordType = word.type;
            if (openFormat && (!wordType || wordType !== openFormat)) {
                closeFormat();
            }

            if (i > 0 && !(wordType && wordType.attachWithoutWhitespace) && !isPunctationCharacter(word.string)) {
                text += ' ';
            }
            if (wordType && (!disableInlineFormats || wordType.plainTextFormat)) {
                if (wordType.format) {
                    if (!openFormat) {
                        openFormat = wordType;
                        text += openFormat.startSymbol;
                    }
                    text += word.string;
                } else {
                    text += wordType.toText(word.string);
                }
            } else {
                text += word.string;
            }
        });
        if (openFormat && (lineIndex == lineItems.length - 1 || firstFormat(lineItems[lineIndex + 1]) !== openFormat)) {
            closeFormat();
        }
        text += '\n';
    });
    return text;
}

function firstFormat(lineItem) {
    if (lineItem.words.length == 0) {
        return null;
    }
    return lineItem.words[0].type;
}

function isPunctationCharacter(string) {
    if (string.length != 1) {
        return false;
    }
    return string[0] === '.' || string[0] === '!' || string[0] === '?';
}
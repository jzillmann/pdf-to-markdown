const MIN_DIGIT_CHAR_CODE = 48;
const MAX_DIGIT_CHAR_CODE = 57;
const WHITESPACE_CHAR_CODE = 32;
const TAB_CHAR_CODE = 9;
const DOT_CHAR_CODE = 46;

export function isDigit(charCode) {
    return charCode >= MIN_DIGIT_CHAR_CODE && charCode <= MAX_DIGIT_CHAR_CODE;
}

export function isNumber(string) {
    for (var i = 0; i < string.length; i++) {
        const charCode = string.charCodeAt(i);
        if (!isDigit(charCode)) {
            return false;
        }
    }
    return true;
}

export function hasUpperCaseCharacterInMiddleOfWord(text) {
    var beginningOfWord = true;
    for (var i = 0; i < text.length; i++) {
        const character = text.charAt(i);
        if (character === ' ') {
            beginningOfWord = true;
        } else {
            if (!beginningOfWord && isNaN(character * 1) && character == character.toUpperCase() && character.toUpperCase() != character.toLowerCase()) {
                return true;
            }
            beginningOfWord = false;
        }
    }
    return false;
}

// Remove whitespace/dots + to uppercase
export function normalizedCharCodeArray(string) {
    string = string.toUpperCase();
    return charCodeArray(string).filter(charCode => charCode != WHITESPACE_CHAR_CODE && charCode != TAB_CHAR_CODE && charCode != DOT_CHAR_CODE);
}

export function charCodeArray(string) {
    const charCodes = [];
    for (var i = 0; i < string.length; i++) {
        charCodes.push(string.charCodeAt(i));
    }
    return charCodes;
}
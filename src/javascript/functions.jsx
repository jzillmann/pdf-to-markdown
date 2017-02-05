export function isDigit(charCode) {
    return charCode >= 48 && charCode <= 57;
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

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
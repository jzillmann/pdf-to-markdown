import { expect } from 'chai';

import { hasUpperCaseCharacterInMiddleOfWord, normalizedCharCodeArray, removeLeadingWhitespaces, removeTrailingWhitespaces, prefixAfterWhitespace, suffixBeforeWhitespace, charCodeArray, isListItem, isNumberedListItem, wordMatch } from '../src/javascript/lib/stringFunctions.jsx'

describe('functions: hasUpperCaseCharacterInMiddleOfWord', () => {

    it('single word', () => {

        expect(hasUpperCaseCharacterInMiddleOfWord("word")).to.equal(false);
        expect(hasUpperCaseCharacterInMiddleOfWord("Word")).to.equal(false);

        expect(hasUpperCaseCharacterInMiddleOfWord("wOrd")).to.equal(true);
        expect(hasUpperCaseCharacterInMiddleOfWord("woRd")).to.equal(true);
        expect(hasUpperCaseCharacterInMiddleOfWord("worD")).to.equal(true);
    });

    it('multi words', () => {
        expect(hasUpperCaseCharacterInMiddleOfWord("Hello World")).to.equal(false);
        expect(hasUpperCaseCharacterInMiddleOfWord("hello world")).to.equal(false);

        expect(hasUpperCaseCharacterInMiddleOfWord("HelloWorld")).to.equal(true);
        expect(hasUpperCaseCharacterInMiddleOfWord("HellO World")).to.equal(true);
        expect(hasUpperCaseCharacterInMiddleOfWord("Hello WOrld")).to.equal(true);
        expect(hasUpperCaseCharacterInMiddleOfWord("Hello WorlD")).to.equal(true);
    });

    it('with numbers', () => {
        expect(hasUpperCaseCharacterInMiddleOfWord("high5")).to.equal(false);
        expect(hasUpperCaseCharacterInMiddleOfWord("High5")).to.equal(false);
        expect(hasUpperCaseCharacterInMiddleOfWord("High 5")).to.equal(false);
        expect(hasUpperCaseCharacterInMiddleOfWord("High 5th")).to.equal(false);
        expect(hasUpperCaseCharacterInMiddleOfWord("High 5'sec")).to.equal(false);
        expect(hasUpperCaseCharacterInMiddleOfWord("Type-0-mat")).to.equal(false);

        expect(hasUpperCaseCharacterInMiddleOfWord("HigH 5")).to.equal(true);
        expect(hasUpperCaseCharacterInMiddleOfWord("High 5E")).to.equal(true);
        expect(hasUpperCaseCharacterInMiddleOfWord("High 5 or tWo down")).to.equal(true);
        expect(hasUpperCaseCharacterInMiddleOfWord("High 5'Sec")).to.equal(true);
    });
});

describe('functions: removeLeadingWhitespaces', () => {
    it('No Removes', () => {
        expect(removeLeadingWhitespaces(".")).to.be.equal(".");
        expect(removeLeadingWhitespaces(". ")).to.be.equal(". ");
        expect(removeLeadingWhitespaces(". . ")).to.be.equal(". . ");
    });

    it('Removes', () => {
        expect(removeLeadingWhitespaces(" .")).to.be.equal(".");
        expect(removeLeadingWhitespaces("  .")).to.be.equal(".");
        expect(removeLeadingWhitespaces("  . ")).to.be.equal(". ");
        expect(removeLeadingWhitespaces("  . . ")).to.be.equal(". . ");
    });

});

describe('functions: removeTrailingWhitespaces', () => {
    it('No Removes', () => {
        expect(removeTrailingWhitespaces(".")).to.be.equal(".");
        expect(removeTrailingWhitespaces(" .")).to.be.equal(" .");
        expect(removeTrailingWhitespaces(" . .")).to.be.equal(" . .");
    });

    it('Removes', () => {
        expect(removeTrailingWhitespaces(". ")).to.be.equal(".");
        expect(removeTrailingWhitespaces(".  ")).to.be.equal(".");
        expect(removeTrailingWhitespaces(" . ")).to.be.equal(" .");
        expect(removeTrailingWhitespaces(" . .  ")).to.be.equal(" . .");
    });

});


describe('functions: prefixAfterWhitespace', () => {
    it('Basic', () => {
        expect(prefixAfterWhitespace('1', '2')).to.be.equal('12');
        expect(prefixAfterWhitespace(' 1', '2')).to.be.equal(' 12');
        expect(prefixAfterWhitespace(' 1', ' 2')).to.be.equal('  12');
        expect(prefixAfterWhitespace('1', ' 2')).to.be.equal(' 12');
        expect(prefixAfterWhitespace('1', '  2')).to.be.equal(' 12');
    });
});

describe('functions: suffixBeforeWhitespace', () => {
    it('Basic', () => {
        expect(suffixBeforeWhitespace('A ', '.')).to.be.equal('A. ');
        expect(suffixBeforeWhitespace(' A', '.')).to.be.equal(' A.');
        expect(suffixBeforeWhitespace(' A ', ' .')).to.be.equal(' A . ');
        expect(suffixBeforeWhitespace('A', ' .')).to.be.equal('A .');
        expect(suffixBeforeWhitespace('A  ', '.')).to.be.equal('A. ');
    });
});


describe('functions: charCodeArray', () => {
    it('Charcodes', () => {
        expect(charCodeArray(".")).to.have.lengthOf(1).to.contain(46);
    });

    it('Convert Back', () => {
        expect(String.fromCharCode.apply(null, charCodeArray("word"))).to.equal("word");
        expect(String.fromCharCode.apply(null, charCodeArray("WORD"))).to.equal("WORD");
        expect(String.fromCharCode.apply(null, charCodeArray("a word"))).to.equal("a word");
    });

});

describe('functions: normalizedCharCodeArray', () => {

    it('No Change', () => {
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("WORD"))).to.equal("WORD");
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("WORD23"))).to.equal("WORD23");
    });

    it('lowecaseToUpperCase', () => {
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("word"))).to.equal("WORD");
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("WoRd"))).to.equal("WORD");
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("word23"))).to.equal("WORD23");
    });

    it('RemoveWhiteSpace', () => {
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("A WORD"))).to.equal("AWORD");
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("SOME LITTLE SENTENCE."))).to.equal("SOMELITTLESENTENCE");
    });

    it('All', () => {
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("a word"))).to.equal("AWORD");
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("WoRd 4 u"))).to.equal("WORD4U");
        expect(String.fromCharCode.apply(null, normalizedCharCodeArray("Some little sentence."))).to.equal("SOMELITTLESENTENCE");
    });

});

describe('functions: isListItem', () => {

    it('Match', () => {
        expect(isListItem('- my text')).to.equal(true);
        expect(isListItem('- my text -')).to.equal(true);
        expect(isListItem(' - my text')).to.equal(true);
        expect(isListItem('  - my text')).to.equal(true);
        expect(isListItem(' -  my text')).to.equal(true);

        expect(isListItem('• my text')).to.equal(true);
        expect(isListItem(' • my text')).to.equal(true);
        expect(isListItem('  • my text')).to.equal(true);

        expect(isListItem('– my text')).to.equal(true);
        expect(isListItem(' – my text')).to.equal(true);
    });

    it('No Match', () => {
        expect(isListItem('my text')).to.equal(false);
        expect(isListItem('-my text')).to.equal(false);
        expect(isListItem('•my text')).to.equal(false);
        expect(isListItem(' -my text')).to.equal(false);
    });

});

describe('functions: isNumberedListItem', () => {

    it('Match', () => {
        expect(isNumberedListItem('1. my text')).to.equal(true);
        expect(isNumberedListItem('2. my text')).to.equal(true);
        expect(isNumberedListItem('23. my text')).to.equal(true);
        expect(isNumberedListItem('23.   my text')).to.equal(true);
        expect(isNumberedListItem(' 23.   my text')).to.equal(true);
        expect(isNumberedListItem('  23.   my text')).to.equal(true);
    });

    it('No Match', () => {
        expect(isNumberedListItem('1two')).to.equal(false);
        expect(isNumberedListItem('1 two')).to.equal(false);
        expect(isNumberedListItem('1.two')).to.equal(false);
    });

});

describe('functions: wordsMatch', () => {

    it('Match', () => {
        expect(wordMatch('text 1', 'text 1')).to.equal(1.0);
        expect(wordMatch('text 1', 'text 2')).to.equal(0.5);
        expect(wordMatch('text 1', 'text 1 2')).to.equal(0.6666666666666666);
        expect(wordMatch('text 1 2 3', 'text 1 4 5')).to.equal(0.5);
        expect(wordMatch('text 1 2 3', '5 1 4 text')).to.equal(0.5);
        expect(wordMatch('text 1 2 3', 'text')).to.equal(0.25);

        expect(wordMatch('text', 'test')).to.equal(0.0);

        expect(wordMatch('inStruCtionS for the full Moon proCeSS', 'Instructions for the Full Moon Process')).to.equal(1.0);
    });

});

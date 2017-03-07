import { expect } from 'chai';

import { hasUpperCaseCharacterInMiddleOfWord, normalizedCharCodeArray, charCodeArray } from '../src/javascript/functions.jsx'

describe('hasUpperCaseCharacterInMiddleOfWord', () => {

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

describe('charCodeArray', () => {
    it('Charcodes', () => {
        expect(charCodeArray(".")).to.have.lengthOf(1).to.contain(46);
    });

    it('Convert Back', () => {
        expect(String.fromCharCode.apply(null, charCodeArray("word"))).to.equal("word");
        expect(String.fromCharCode.apply(null, charCodeArray("WORD"))).to.equal("WORD");
        expect(String.fromCharCode.apply(null, charCodeArray("a word"))).to.equal("a word");
    });

});

describe('normalizedCharCodeArray', () => {

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

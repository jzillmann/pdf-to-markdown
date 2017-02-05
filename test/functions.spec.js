import { expect } from 'chai';

import { hasUpperCaseCharacterInMiddleOfWord } from '../src/javascript/functions.jsx'

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

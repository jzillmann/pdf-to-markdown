import { expect } from 'chai';

import Headline from '../src/javascript/models/markdown/Headline';

describe('Headline', () => {

    it('correct level 1 props', () => {
        const headline = new Headline({
            level: 1
        });
        expect(headline.level).to.equal(1);
        expect(headline.newLineBefore).to.equal(true);
        expect(headline.newLineAfter).to.equal(true);
        expect(headline.transformText('Hello World')).to.equal('# Hello World');
    });

    it('correct level 2 props', () => {
        const headline = new Headline({
            level: 2
        });
        expect(headline.level).to.equal(2);
        expect(headline.newLineBefore).to.equal(true);
        expect(headline.newLineAfter).to.equal(true);
        expect(headline.transformText('Hello World')).to.equal('## Hello World');
    });

});

import { expect } from 'chai';

import HeadlineFinder from '../src/javascript/models/HeadlineFinder';
import LineItem from '../src/javascript/models/LineItem.jsx';

describe('HeadlineFinder', () => {

    it('Not Found - Case 1', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'My Little Headline'
        });
        const item1 = new LineItem({
            text: 'My '
        });
        const item2 = new LineItem({
            text: 'Little'
        });
        const item3 = new LineItem({
            text: ' Headline2'
        });

        expect(headlineFinder.consume(item1)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(1).to.contain(item1);
        expect(headlineFinder.consume(item2)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(2).to.contain(item1).to.contain(item2);
        expect(headlineFinder.consume(item3)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(0);

    });

    it('Found - Simple', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'My Little Headline'
        });
        const item1 = new LineItem({
            text: 'My '
        });
        const item2 = new LineItem({
            text: 'Little'
        });
        const item3 = new LineItem({
            text: ' Headline'
        });

        expect(headlineFinder.consume(item1)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(1).to.contain(item1);
        expect(headlineFinder.consume(item2)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(2).to.contain(item1).to.contain(item2);
        expect(headlineFinder.consume(item3)).to.have.lengthOf(3).to.contain(item1).to.contain(item2).to.contain(item3);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(3).to.contain(item1).to.contain(item2).to.contain(item3);

    });

    it('Found - Waste in beginning', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'My Little Headline'
        });
        const item0 = new LineItem({
            text: 'Waste '
        });
        const item1 = new LineItem({
            text: 'My '
        });
        const item2 = new LineItem({
            text: 'Little'
        });
        const item3 = new LineItem({
            text: ' Headline'
        });

        expect(headlineFinder.consume(item0)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(0);
        expect(headlineFinder.consume(item1)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(1).to.contain(item1);
        expect(headlineFinder.consume(item2)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(2).to.contain(item1).to.contain(item2);
        expect(headlineFinder.consume(item3)).to.have.lengthOf(3).to.contain(item1).to.contain(item2).to.contain(item3);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(3).to.contain(item1).to.contain(item2).to.contain(item3);

    });

    it('Found - Duplicate in beginning', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'My Little Headline'
        });
        const item0 = new LineItem({
            text: 'My '
        });
        const item1 = new LineItem({
            text: 'My '
        });
        const item2 = new LineItem({
            text: 'Little'
        });
        const item3 = new LineItem({
            text: ' Headline'
        });

        expect(headlineFinder.consume(item0)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(1).to.contain(item0);
        expect(headlineFinder.consume(item1)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(1).to.contain(item1);
        expect(headlineFinder.consume(item2)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(2).to.contain(item1).to.contain(item2);
        expect(headlineFinder.consume(item3)).to.have.lengthOf(3).to.contain(item1).to.contain(item2).to.contain(item3);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(3).to.contain(item1).to.contain(item2).to.contain(item3);

    });

    it('Found - Mixed up case and Whitespace', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'MYLitt le HEADline'
        });
        const item1 = new LineItem({
            text: 'My '
        });
        const item2 = new LineItem({
            text: 'Little'
        });
        const item3 = new LineItem({
            text: ' Headline'
        });

        expect(headlineFinder.consume(item1)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(1).to.contain(item1);
        expect(headlineFinder.consume(item2)).to.equal(null);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(2).to.contain(item1).to.contain(item2);
        expect(headlineFinder.consume(item3)).to.have.lengthOf(3).to.contain(item1).to.contain(item2).to.contain(item3);
        expect(headlineFinder.stackedLineItems).to.have.lengthOf(3).to.contain(item1).to.contain(item2).to.contain(item3);

    });

});

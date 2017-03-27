import { expect } from 'chai';

import StashingStream from '../../src/javascript/models/StashingStream';
import TextItem from '../../src/javascript/models/TextItem.jsx';

describe('StashingStream', () => {

    it('Simple', () => {
        const stream = new MyStashingStream();

        stream.consume('a');
        stream.consume('b');
        stream.consume('a');
        stream.consume('a');
        stream.consume('z');
        stream.consume('m');
        stream.consume('m');
        stream.consume('z');
        stream.consume('z');
        stream.consume('c');
        stream.consume('e');
        stream.consume('f');
        stream.consume('m');
        stream.consume('a');

        const resultsAsString = stream.complete().join('');

        expect(resultsAsString).to.equal('AbAAZZZcefA');
        expect(stream.transformedItems).to.equal(10);
    });

    it('ConsumeAll', () => {
        const items = ['k', 'k', 'x', 'a', 'm', 'z', 'o', 'p']
        const stream = new MyStashingStream();
        stream.consumeAll(items);

        const resultsAsString = stream.complete().join('');
        expect(resultsAsString).to.equal('kkxAZop');
        expect(stream.transformedItems).to.equal(3);
    });

});


class MyStashingStream extends StashingStream {

    constructor() {
        super();
        this.transformedItems = 0;
    }

    shouldStash(item) {
        return item === 'a' || item === 'z' || item === 'm';
    }

    doMatchesStash(lastItem, item) {
        return lastItem === item;
    }

    doFlushStash(stash, results) {
        this.transformedItems += stash.length;
        results.push(...stash.filter(elem => elem !== 'm').map(item => item.toUpperCase()));
    }
}
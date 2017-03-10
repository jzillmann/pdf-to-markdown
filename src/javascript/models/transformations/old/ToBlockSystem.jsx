import React from 'react';
import Transformation from './Transformation.jsx';
import BlockPageView from '../../components/debug/BlockPageView.jsx';
import ParseResult from '../ParseResult.jsx';
import BlockPage from '../BlockPage.jsx';

export default class ToBlockSystem extends Transformation {

    constructor() {
        super("To Block System");
    }

    createPageView(page, modificationsOnly) { // eslint-disable-line no-unused-vars
        return <BlockPageView key={ page.index } page={ page } />;
    }

    transform(parseResult:ParseResult) {
        const blocks = [];
        parseResult.content.forEach(page => {
            var minDiff = 99;
            var lastY = 0;
            page.textItems.forEach(item => {
                if (lastY > 0) {
                    const yDiff = lastY - item.y - item.height;
                    if (yDiff > 0) {
                        minDiff = Math.min(minDiff, yDiff);
                    }
                }
                lastY = item.y;
            });

            var text;
            const rollup = (category) => {
                if (text && text.length > 0) {
                    // console.debug("Push[" + blocks.length + "]: " + text);
                    blocks.push({
                        category: category,
                        text: text
                    });
                }
                text = null;
            };

            lastY = 0;
            page.textItems.forEach(item => {
                if (item.markdownElement) {
                    rollup("Block");
                    text = item.markdownElement.transformText(item.text);
                    rollup(item.markdownElement.constructor.name);
                } else if (!text) {
                    text = item.text;
                } else {
                    const yDiff = lastY - item.y - item.height;
                    if (yDiff > minDiff + 2) {
                        rollup("Block");
                        text = item.text;
                    } else {
                        text += '\n' + item.text;
                    }
                }
                lastY = item.y;
            });
            rollup("Block")
        });
        return new ParseResult({
            ...parseResult,
            content: [new BlockPage({
                index: 0,
                blocks: blocks
            })],
        });
    }

}
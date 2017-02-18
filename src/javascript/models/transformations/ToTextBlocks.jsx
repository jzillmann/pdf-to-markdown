import React from 'react';
import Transformation from './Transformation.jsx';
import BlockPageView from '../../components/debug/BlockPageView.jsx';
import ParseResult from '../ParseResult.jsx';
import BlockPage from '../BlockPage.jsx';
import { blockToText } from '../MarkdownElements.jsx';

export default class ToTextBlocks extends Transformation {

    constructor() {
        super("To Text Blocks");
    }

    createPageView(page, modificationsOnly) { // eslint-disable-line no-unused-vars
        return <BlockPageView key={ page.index } page={ page } />;
    }

    transform(parseResult:ParseResult) {
        const blocks = [];
        parseResult.content.forEach(page => {
            page.blocks.forEach(block => {
                const category = block.type ? block.type : 'Unknown';
                blocks.push({
                    category: category,
                    text: blockToText(block)
                });
            });

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
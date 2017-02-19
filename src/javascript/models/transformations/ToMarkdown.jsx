import React from 'react';
import MarkdownPageView from '../../components/debug/MarkdownPageView.jsx';
import Transformation from './Transformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextPage from '../TextPage.jsx';

export default class ToMarkdown extends Transformation {

    constructor() {
        super("To Markdown");
    }

    createPageView(page, modificationsOnly) { // eslint-disable-line no-unused-vars
        return <MarkdownPageView key={ page.index } page={ page } />;
    }

    transform(parseResult:ParseResult) {
        var text = '';
        parseResult.content.forEach(page => {
            page.blocks.forEach((block) => {
                text += block.text + '\n';
            });
        });
        return new ParseResult({
            ...parseResult,
            content: [new TextPage({
                index: 0,
                text: text
            })],
        });
    }

}
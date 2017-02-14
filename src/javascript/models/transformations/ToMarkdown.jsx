import React from 'react';
import MarkdownPageView from '../../components/debug/MarkdownPageView.jsx';
import Transformation from './Transformation.jsx';
import TextPage from '../TextPage.jsx';

export default class ToMarkdown extends Transformation {

    constructor() {
        super("To Markdown");
    }

    createPageView(page, modificationsOnly) { // eslint-disable-line no-unused-vars
        return <MarkdownPageView key={ page.index } page={ page } />;
    }

    transform(pages:TextPage[]) {
        var text = '';
        pages.forEach(page => {
            page.blocks.forEach((block) => {
                text += block.text + '\n\n';
            });
        });
        return [new TextPage({
            index: 0,
            text: text
        })];
    }

}
import React from 'react';
import MarkdownPageView from '../../components/debug/MarkdownPageView.jsx';
import Transformation from './Transformation.jsx';
import ParseResult from '../ParseResult.jsx';

export default class ToMarkdown extends Transformation {

    constructor() {
        super("To Markdown", "String");
    }

    createPageView(page, modificationsOnly) { // eslint-disable-line no-unused-vars
        return <MarkdownPageView key={ page.index } page={ page } />;
    }

    transform(parseResult:ParseResult) {
        parseResult.pages.forEach(page => {
            var text = '';
            page.items.forEach(block => {

                // Concatenate all words in the same block, unless it's a Table of Contents block
                if (block.category == "TOC") {
                    var concatText = block.text
                } else {
                    var concatText = block.text.replace(/(\r\n|\n|\r)/gm, " ");
                }

                // Concatenate words that were previously broken up by newline
                if (block.category !== "LIST") {
                    var concatText = concatText.split("- ").join("");
                }

                // Assume there are no code blocks in our documents
                if (block.category == "CODE") {
                    var concatText = concatText.split("`").join("");
                }
                
                text += concatText + '\n\n';
            });

            page.items = [text];
        });
        return new ParseResult({
            ...parseResult,
        });
    }

}

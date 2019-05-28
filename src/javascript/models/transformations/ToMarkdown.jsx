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
                if (block.category == "TOC") {
                    // Don't concatenate words in Table of Contents
                    var concatWords = block.text
                } else {
                    // Concatenate words in same block by removing newlines
                    var concatText = block.text.replace(/(\r\n|\n|\r)/gm, " ");

                    // Concat words broken up by newline
                    var concatWords = concatText.split("- ").join("");

                    // // TODO Find '- ', remove it and check if it's a word
                    // // If it's a word, remove '- '
                    // // If not, replace it with '-'
                    // if (concatText.includes("- ")) {
                    //     var splitText = concatText.split("- ")
                    //
                    //     var i;
                    //     for (i = 1; i < splitText.length; i++) {
                    //         var precedingText = splitText[i-1].split(" ").slice(-1)[0]
                    //         var succeedingText = splitText[i].split(" ")[0]
                    //         var word = precedingText + succeedingText
                    //     }
                    // }
                }

                if (block.category == "CODE") {
                    // Remove all code blocks. Assume documents have no code blocks
                    var concatWords = concatWords.split("`").join("");
                }
                text += concatWords + '\n\n';
            });

            page.items = [text];
        });
        return new ParseResult({
            ...parseResult,
        });
    }

}

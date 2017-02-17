import React from 'react';
import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import TextItem from '../TextItem.jsx';
import ParseResult from '../ParseResult.jsx';
import { REMOVED_ANNOTATION } from '../Annotation.jsx';
import Annotation from '../Annotation.jsx';

//Detect word/sentence formats like bold, italic,...
export default class DetectFormats extends ToPdfViewTransformation {

    constructor() {
        super("Detect Bold/Italic");
    }

    createSummaryView(parseResult:ParseResult) {
        return <div>
                 Detected
                 { ' ' + parseResult.summary.foundFormats + ' ' } formats.
               </div>;
    }


    transform(parseResult:ParseResult) {
        var foundFormats = 0;
        const {mostUsedHeight, mostUsedFont, maxHeightFont} = parseResult.globals;
        const symbols = {
            bold: '**',
            emphasis: '_'
        }

        const newContent = parseResult.content.map(page => {
            const newTextItems = [];

            //bundle items on same Y
            const groupedItems = groupByFollowingY(page.textItems);
            var lastItem;
            var lastFormat;

            const addNextItem = (item, format) => {
                if (lastItem) {
                    if (lastFormat !== format) {
                        lastItem.text = appendSymbol(lastItem.text, symbols[lastFormat]);
                        if (lastItem.annotation) {
                            lastItem.annotation = newAnnotation(lastFormat);
                        } else {
                            lastItem.annotation = newAnnotation('End ' + lastFormat);
                        }
                    }
                    lastItem.height = mostUsedHeight;
                    newTextItems.push(lastItem);
                }

                if (format) {
                    if (lastFormat !== format) {
                        item.text = prependSymbol(item.text, symbols[format]);
                        item.annotation = newAnnotation('Start ' + format);
                    }
                    lastItem = item;
                    lastFormat = format;
                } else {
                    newTextItems.push(item);
                    lastItem = null;
                    lastFormat = null;
                }
            };


            groupedItems.forEach(itemGroup => {

                //probably headline
                const differentHeightsButSameFont = itemsHaveDifferentHeightsButSameFont(itemGroup);

                itemGroup.forEach(item => {
                    const paragraphHeighOrSlightlyBigger = item.height == mostUsedHeight || item.height == mostUsedHeight + 1;
                    if (!differentHeightsButSameFont && paragraphHeighOrSlightlyBigger && item.font !== mostUsedFont) {
                        // item.annotation = REMOVED_ANNOTATION;

                        const format = item.font === maxHeightFont ? 'bold' : 'emphasis';
                        addNextItem(item, format);

                        //TODO test with womb compilation. _Th_, _ff_,... check font like SanSarif ?
                        //TODO don't touch 'eingerückte' Zeichen => detect early ?
                        //TODO (Maybe) could detect combined bold & emphasis like font=bold.font + emph.font !?
                        foundFormats++;
                    } else {
                        addNextItem(item);
                    }
                });
            });

            return {
                ...page,
                textItems: newTextItems
            };
        });
        return new ParseResult({
            ...parseResult,
            content: newContent,
            summary: {
                foundFormats: foundFormats
            }
        });
    }

    completeTransform(parseResult:ParseResult) {
        parseResult.content.forEach(page => {
            page.textItems = page.textItems.filter(textItem => !textItem.annotation || textItem.annotation !== REMOVED_ANNOTATION);
            page.textItems.forEach(textItem => textItem.annotation = null)
        });
        return parseResult;
    }

}

function newAnnotation(name) {
    return new Annotation({
        category: name,
        color: 'green'
    });
}

//groups all following text items with the same Y together
function groupByFollowingY(textItems) {
    const yArrays = [];
    var itemsWithSameY = [];
    var lastItem;
    textItems.forEach(item => {
        if (itemsWithSameY.length == 0 || item.y == lastItem.y) {
            itemsWithSameY.push(item);
        } else {
            yArrays.push(itemsWithSameY);
            itemsWithSameY = [item];
        }
        lastItem = item;
    })
    yArrays.push(itemsWithSameY);
    return yArrays;
}

function itemsHaveDifferentHeightsButSameFont(itemGroup) {
    var heights = new Set();
    var fonts = new Set();
    itemGroup.forEach(item => {
        heights.add(item.height);
        fonts.add(item.font);
    });
    return heights.size > 1 && fonts.size == 1;
}

//TODO move to stringFunctions

function prependSymbol(text, symbol) {
    if (text.charAt(0) == ' ') {
        return ' ' + symbol + removeLeadingWhitespace(text);
    }
    return symbol + text;
}

function appendSymbol(text, symbol) {
    if (text.charAt(text.length - 1) == ' ') {
        return removeTrailingWhitespace(text) + symbol + ' ';
    }
    return text + symbol;
}

function removeLeadingWhitespace(text) {
    while (text.charAt(0) == ' ') {
        text = text.substring(1, text.length);
    }
    return text;
}

function removeTrailingWhitespace(text) {
    while (text.charAt(text.length - 1) == ' ') {
        text = text.substring(0, text.length - 1);
    }
    return text;
}

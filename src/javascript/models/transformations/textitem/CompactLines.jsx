import React from 'react';

import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import { ParsedElements } from '../../PageItem.jsx';
import TextItemLineGrouper from '../../TextItemLineGrouper.jsx';
import TextItemLineCompactor from '../../TextItemLineCompactor.jsx';
import ElementType from '../../ElementType.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../../Annotation.jsx';


// gathers text items on the same y line to one text item
export default class CompactLines extends ToTextItemTransformation {

    constructor() {
        super("Compact To Lines");
    }

    transform(parseResult:ParseResult) {
        const {mostUsedDistance, fontToFormats} = parseResult.globals;
        const foundFootnotes = [];
        const foundFootnoteLinks = [];
        var inlineFormats = 0;
        var lineFormats = 0;
        var unopenedFormats = 0;
        var unclosedFormats = 0;

        const lineGrouper = new TextItemLineGrouper({
            mostUsedDistance: mostUsedDistance,
        });
        const lineCompactor = new TextItemLineCompactor(fontToFormats);

        parseResult.pages.forEach(page => {
            if (page.items.length > 0) {
                const newItems = [];
                const textItemsGroupedByLine = lineGrouper.group(page.items);
                textItemsGroupedByLine.forEach(textItemsOfLine => {
                    var lineItem;
                    if (textItemsOfLine.length == 1) {
                        lineItem = textItemsOfLine[0];
                        const formatType = fontToFormats.get(lineItem.font);
                        if (formatType.needFormat) {
                            lineItem.lineFormat = formatType;
                            lineItem.parsedElements = new ParsedElements({
                                completeLineFormats: 1
                            });
                        }
                    } else {
                        textItemsOfLine.forEach(item => {
                            item.annotation = REMOVED_ANNOTATION;
                            newItems.push(item);
                        });

                        lineItem = lineCompactor.compact(textItemsOfLine);
                        lineItem.annotation = ADDED_ANNOTATION;

                        if (lineItem.parsedElements.footnoteLinks.length > 0) {
                            const footnoteLinks = lineItem.parsedElements.footnoteLinks.map(footnoteLink => <span key={ footnoteLink }><a href={ "#Page " + (page.index + 1) }>{ footnoteLink }</a>,</span>);
                            foundFootnoteLinks.push.apply(foundFootnoteLinks, footnoteLinks);
                        }
                        if (lineItem.parsedElements.footnotes.length > 0) {
                            lineItem.type = ElementType.FOOTNOTES;
                            const footnotes = lineItem.parsedElements.footnotes.map(footnote => <span key={ footnote }><a href={ "#Page " + (page.index + 1) }>{ footnote }</a>,</span>);
                            foundFootnotes.push.apply(foundFootnotes, footnotes);
                        }
                        inlineFormats += lineItem.parsedElements.inlineFormats;
                    }
                    if (lineItem.lineFormat) lineFormats++;
                    if (lineItem.unopenedFormat) unopenedFormats++;
                    if (lineItem.unclosedFormat) unclosedFormats++;
                    lineItem.text = lineItem.text.trim();
                    newItems.push(lineItem);
                });
                page.items = newItems;
            }
        });


        return new ParseResult({
            ...parseResult,
            messages: [
                'Detected ' + lineFormats + ' line formats',
                'Detected ' + inlineFormats + ' inline formats',
                'Detected ' + unclosedFormats + ' opened un-closed formats',
                'Detected ' + unopenedFormats + ' un-opened closed formats',
                <span>Detected { foundFootnoteLinks.length } footnotes: [{ foundFootnoteLinks }]</span>,
                <span>Detected { foundFootnotes.length } footnotes: [{ foundFootnotes }]</span>,
            ]
        });
    }


}

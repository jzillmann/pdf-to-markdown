import React from 'react';

import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
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
        const {mostUsedDistance} = parseResult.globals;
        const foundFootnotes = [];
        const foundFootnoteLinks = [];
        const lineGrouper = new TextItemLineGrouper({
            mostUsedDistance: mostUsedDistance,
        });
        const lineCompactor = new TextItemLineCompactor();

        parseResult.pages.forEach(page => {
            if (page.items.length > 0) {
                const newItems = [];
                const textItemsGroupedByLine = lineGrouper.group(page.items);
                textItemsGroupedByLine.forEach(textItemsOfLine => {
                    var lineItem;
                    if (textItemsOfLine.length == 1) {
                        lineItem = textItemsOfLine[0];
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
                    }
                    lineItem.text = lineItem.text.trim();
                    newItems.push(lineItem);
                });
                page.items = newItems;
            }
        });


        return new ParseResult({
            ...parseResult,
            messages: [
                // 'Detected ' + foundFootnoteLinks.length + ' footnote links: [' + foundFootnoteLinks.join(', ') + ']',
                //'Detected ' + foundFootnotes.length + ' footnotes: [' + foundFootnotes.join(', ') + ']',
                // 'Detected ' + foundFootnotes.length + ' footnotes: [' + foundFootnotes + ']',
                <span>Detected { foundFootnoteLinks.length } footnotes: [{ foundFootnoteLinks }]</span>,
                <span>Detected { foundFootnotes.length } footnotes: [{ foundFootnotes }]</span>,
            ]
        });
    }


}

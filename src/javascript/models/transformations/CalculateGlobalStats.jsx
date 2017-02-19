import React from 'react';
import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';

export default class CalculateGlobalStats extends ToPdfViewTransformation {

    constructor() {
        super("Calculate Statistics");
    }

    createSummaryView(parseResult:ParseResult) {
        return <div>
                 <ul>
                   <li>
                     { 'Most-used height: ' + parseResult.globals.mostUsedHeight + ' ' }
                   </li>
                   <li>
                     { 'Most-used font: ' + parseResult.globals.mostUsedFont + ' ' }
                   </li>
                   <li>
                     { 'Most-used distance: ' + parseResult.globals.mostUsedDistance + ' ' }
                   </li>
                   <li>
                     { 'Max height: ' + parseResult.globals.maxHeight + ' ' }
                   </li>
                   <li>
                     { 'Max height font: ' + parseResult.globals.maxHeightFont + ' ' }
                   </li>
                   <hr/>
                   <li>
                     { 'Items per height: ' + JSON.stringify(parseResult.summary.heightToOccurrence) + ' ' }
                   </li>
                   <li>
                     { 'Items per font: ' + JSON.stringify(parseResult.summary.fontToOccurrence) + ' ' }
                   </li>
                   <li>
                     { 'Items per distance: ' + JSON.stringify(parseResult.summary.distanceToOccurrence) + ' ' }
                   </li>
                 </ul>
               </div>;
    }

    transform(parseResult:ParseResult) {

        // Parse heights
        const heightToOccurrence = {};
        const fontToOccurrence = {};
        var maxHeight = 0;
        var maxHeightFont;
        parseResult.content.forEach(page => {
            page.textItems.forEach(item => {
                heightToOccurrence[item.height] = heightToOccurrence[item.height] ? heightToOccurrence[item.height] + 1 : 1;
                fontToOccurrence[item.font] = fontToOccurrence[item.font] ? fontToOccurrence[item.font] + 1 : 1;
                if (item.height > maxHeight) {
                    maxHeight = item.height;
                    maxHeightFont = item.font;
                }
            });
        });
        const mostUsedHeight = parseInt(getMostUsedKey(heightToOccurrence));
        const mostUsedFont = getMostUsedKey(fontToOccurrence);

        // Parse line distances
        const distanceToOccurrence = {};
        parseResult.content.forEach(page => {
            var lastItemOfMostUsedHeight;
            page.textItems.forEach(item => {
                if (item.height == mostUsedHeight && item.text.trim().length > 0) {
                    if (lastItemOfMostUsedHeight && item.y != lastItemOfMostUsedHeight.y) {
                        const distance = lastItemOfMostUsedHeight.y - item.y;
                        if (distance > 0) {
                            distanceToOccurrence[distance] = distanceToOccurrence[distance] ? distanceToOccurrence[distance] + 1 : 1;
                        }
                    }
                    lastItemOfMostUsedHeight = item;
                } else {
                    lastItemOfMostUsedHeight = null;
                }
            });
        });
        const mostUsedDistance = parseInt(getMostUsedKey(distanceToOccurrence));


        //Make a copy of the originals so all following transformation don't modify them
        const newContent = parseResult.content.map(pdfPage => {
            return {
                ...pdfPage,
                textItems: pdfPage.textItems.map(textItem => {
                    return {
                        ...textItem,
                    }
                })
            };
        });
        return new ParseResult({
            ...parseResult,
            content: newContent,
            globals: {
                mostUsedHeight: mostUsedHeight,
                mostUsedFont: mostUsedFont,
                mostUsedDistance: mostUsedDistance,
                maxHeight: maxHeight,
                maxHeightFont: maxHeightFont,
            },
            summary: {
                heightToOccurrence: heightToOccurrence,
                fontToOccurrence: fontToOccurrence,
                distanceToOccurrence: distanceToOccurrence,
            }
        });
    }


}

function getMostUsedKey(keyToOccurrence) {
    var maxOccurence = 0;
    var maxKey;
    Object.keys(keyToOccurrence).map((element) => {
        if (!maxKey || keyToOccurrence[element] > maxOccurence) {
            maxOccurence = keyToOccurrence[element];
            maxKey = element;
        }
    });
    return maxKey;
}
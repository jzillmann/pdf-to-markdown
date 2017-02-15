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
                   <hr/>
                   <li>
                     { 'Items per height: ' + JSON.stringify(parseResult.summary.heightToOccurrence) + ' ' }
                   </li>
                   <li>
                     { 'Items per font: ' + JSON.stringify(parseResult.summary.fontToOccurrence) + ' ' }
                   </li>
                 </ul>
               </div>;
    }

    transform(parseResult:ParseResult) {
        const heightToOccurrence = {};
        const fontToOccurrence = {};
        parseResult.content.forEach(page => {
            page.textItems.forEach(item => {
                heightToOccurrence[item.height] = heightToOccurrence[item.height] ? heightToOccurrence[item.height] + 1 : 1;
                fontToOccurrence[item.font] = fontToOccurrence[item.font] ? fontToOccurrence[item.font] + 1 : 1;
            });
        });
        const mostUsedHeight = parseInt(getMostUsedKey(heightToOccurrence));
        const mostUsedFont = getMostUsedKey(fontToOccurrence);
        parseResult.globals = {
            mostUsedHeight: mostUsedHeight,
            mostUsedFont: mostUsedFont
        }
        parseResult.summary = {
            heightToOccurrence: heightToOccurrence,
            fontToOccurrence: fontToOccurrence
        }
        return parseResult;
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
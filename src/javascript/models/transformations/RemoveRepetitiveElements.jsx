import Transformation from './Transformation.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';
import Annotation from '../Annotation.jsx';

import { isDigit } from '../../functions.jsx'


function hashCodeIgnoringNumbers(string) {
    var hash = 0, i, charCode, len;
    if (string.length === 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
        charCode = string.charCodeAt(i);
        if (!isDigit(charCode)) {
            hash = ((hash << 5) - hash) + charCode;
            hash |= 0; // Convert to 32bit integer
        }
    }
    return hash;
}

function combineCoordinates(textItem) {
    var hashCode = hashCodeIgnoringNumbers(textItem.text);
    return `${textItem.x}-${textItem.y}-${textItem.width}-${textItem.height}-${hashCode}`;
}

// Remove elements with similar content on same page positions, like page numbers, licenes information, etc...
export default class RemoveRepetitiveElements extends Transformation {

    constructor() {
        super("Remove Repetitive Elements");
    }

    contentView() {
        return ContentView.PDF;
    }

    transform(pages:PdfPage[]) {
        //build repetition counts for every element
        var repetitionCounts = {};
        pages.forEach(pdfPage => {
            pdfPage.textItems.forEach(textItem => {
                var combinedCoordinates = combineCoordinates(textItem);
                repetitionCounts[combinedCoordinates] = repetitionCounts[combinedCoordinates] ? repetitionCounts[combinedCoordinates] + 1 : 1;
            });
        });

        // annotate elements with repetition as removed
        pages.forEach(pdfPage => {
            pdfPage.textItems.forEach(textItem => {
                var combinedCoordinates = combineCoordinates(textItem);
                if (repetitionCounts[combinedCoordinates] > 1) {
                    // console.debug("page " + pdfPage.index + " removed :" + repetitionCounts[combinedCoordinates] + " :" + textItem.text);
                    textItem.annotation = new Annotation({
                        category: 'removed',
                        color: 'red'
                    });
                }
            });
        });
        return pages;
    }

    processAnnotations(pages:PdfPage[]) {
        pages.forEach(page => {
            page.textItems = page.textItems.filter(textItem => !textItem.annotation || textItem.annotation.category !== 'removed');
        });
        return pages;
    }

}
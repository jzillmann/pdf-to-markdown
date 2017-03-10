import Transformation from './Transformation.jsx';
import TextItem from '../TextItem.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';
import { Annotation, ADDED_ANNOTATION, REMOVED_ANNOTATION } from '../Annotation.jsx';

import Headline from '../markdown/Headline.jsx';

function getMostUsedHeight(heightToOccurrence) {
    var maxOccurence = 0;
    var maxHeight = 0;
    Object.keys(heightToOccurrence).map((element) => {
        if (heightToOccurrence[element] > maxOccurence) {
            maxOccurence = heightToOccurrence[element];
            maxHeight = element;
        }
    });
    return parseInt(maxHeight);
}


export default class HeadlineDetector extends Transformation {

    constructor() {
        super("Detect Headlines");
    }

    contentView() {
        return ContentView.PDF;
    }

    // Strategy:
    // - find most used height => this & every height below is paragraph
    // - heights which start a page are likely to be headlines
    // - maxHeigth is likely a headline
    // - heights which occur on more then one page are likely to be headlines
    transform(pages:PdfPage[]) {

        const heightToOccurrence = {};
        pages.forEach(page => {
            page.textItems.forEach(item => {
                heightToOccurrence[item.height] = heightToOccurrence[item.height] ? heightToOccurrence[item.height] + 1 : 1;
            });
        });
        console.debug(heightToOccurrence);
        const mostUsedHeight = getMostUsedHeight(heightToOccurrence);
        console.debug("mostUsedHeight: " + mostUsedHeight);

        const headlineHeights = new Set(Object.keys(heightToOccurrence).filter(height => parseInt(height) > mostUsedHeight).map(elem => parseInt(elem)));
        console.debug(Array.from(headlineHeights));
        const headlineHeights2 = new Set();
        pages.forEach(page => {
            const textItems = page.textItems;
            for (var i = 0; i < textItems.length; i++) {
                const item = textItems[i];
                if (item.height > mostUsedHeight) {

                    item.annotation = ADDED_ANNOTATION;
                    const firstItemOnPage = i == 0;
                    var upperDistance = 99;
                    if (!firstItemOnPage) {
                        upperDistance = textItems[i - 1].y - item.y - item.height;
                    }
                    var lowerDistance = 0;
                    const lastItemOnPage = i == textItems.length - 1;
                    if (!lastItemOnPage) {
                        lowerDistance = item.y - textItems[i + 1].y - textItems[i + 1].height;
                    }
                    if (firstItemOnPage) {
                        console.debug("add " + item.height);
                        console.debug("potential headline: " + item.height + " | " + item.text);
                        console.debug("\tfirstItem=" + firstItemOnPage + ", lastItem:" + lastItemOnPage);
                        console.debug("\tupperDistance/lowerDistance=" + upperDistance + " / " + lowerDistance);
                        headlineHeights2.add(item.height);
                    }

                    // if (!((firstItemOnPage || upperDistance > mostUsedHeight / 2) && lowerDistance > mostUsedHeight / 2)) {
                    //     console.debug("remove " + item.height);
                    //     console.debug("potential headline: " + item.height + " | " + item.text);
                    //     console.debug("\tfirstItem=" + firstItemOnPage + ", lastItem:" + lastItemOnPage);
                    //     console.debug("\tupperDistance/lowerDistance=" + upperDistance + " / " + lowerDistance);
                    //     headlineHeights.delete(item.height);
                    // }


                // if ((firstItemOnPage || upperDistance > 10) && lowerDistance > 10) {
                //     item.annotation = ADDED_ANNOTATION;
                // }
                // console.debug("potential headline: " + item.height + " | " + item.text);
                // console.debug("\tfirstItem=" + firstItemOnPage + ", lastItem:" + lastItemOnPage);
                // console.debug("\tupperDistance/lowerDistance=" + upperDistance + " / " + lowerDistance);
                }
            }
        });
        console.debug(Array.from(headlineHeights2));

        return pages;
    }

    processAnnotations(pages:PdfPage[]) {
        pages.forEach(page => {
            page.textItems.forEach(textItem => textItem.annotation = null)
        });
        return pages;
    }

}
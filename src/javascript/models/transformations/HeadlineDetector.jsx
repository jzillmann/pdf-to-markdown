import Transformation from './Transformation.jsx';
import TextItem from '../TextItem.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';
import Annotation from '../Annotation.jsx';

import Headline from '../markdown/Headline.jsx';


function analyzeHeigths(pages) {
    const analyzationResult = {
        maxHeight: 0,
        maxYPerPage: {},
        heights: [],
        mostUsedHeight: -1
    };
    const allHeights = new Set();
    pages.forEach(page => {
        var maxPageY = 0;
        page.textItems.forEach(item => {
            const height = item.height;
            allHeights.add(height);
            if (analyzationResult[height]) {
                analyzationResult[height].repetition = analyzationResult[height].repetition + 1;
                analyzationResult[height].pages.add(page.index);
            } else {
                analyzationResult[height] = {
                    repetition: 1,
                    pages: new Set([page.index])
                };
            }
            maxPageY = Math.max(maxPageY, item.y);
            analyzationResult.maxHeight = Math.max(analyzationResult.maxHeight, item.height);
        });
        analyzationResult.maxYPerPage[page.index] = maxPageY;
    });

    var maxRepetition = 0;
    allHeights.forEach(height => {
        const heightRepetition = analyzationResult[height].repetition;
        analyzationResult.heights.push(height);
        if (heightRepetition > maxRepetition) {
            maxRepetition = heightRepetition;
            analyzationResult.mostUsedHeight = height;
        }
    });
    analyzationResult.heights = analyzationResult.heights.sort((a, b) => a - b);

    return analyzationResult;
}

function findNextMajorHeight(heights, currentHeight, headlineLevels) {
    for (var i = currentHeight; i < heights.length; i++) {
        if (headlineLevels[heights[i]]) {
            return heights[i];
        }
    }
    throw `Shouldn't happen! heights=${heights}, currentHeight=${currentHeight}, headlineLevels=${headlineLevels}`;
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
        const heightAnalyzation = analyzeHeigths(pages);

        var paragraphHeight = heightAnalyzation.mostUsedHeight + 1;

        // text with more hight then the paragraph height which are on the top of the page are likely to be headlines
        const likelyHeadingHeights = new Set();
        pages.forEach(page => {
            page.textItems.forEach(item => {
                if (item.height > paragraphHeight && heightAnalyzation.maxYPerPage[page.index] == item.y) {
                    likelyHeadingHeights.add(item.height);
                }
            });
        });

        const headlineHeights = [];
        heightAnalyzation.heights.forEach(height => {
            if (height == heightAnalyzation.maxHeight || (height > paragraphHeight && likelyHeadingHeights.has(height) && heightAnalyzation[height].pages.size > 1)) {
                headlineHeights.push(height);
            }
        });


        const headlineLevels = {};
        headlineHeights.reverse().forEach((height, i) => headlineLevels[height] = i + 1);
        var lastMajorHeight = paragraphHeight;
        var heights = heightAnalyzation.heights;
        for (var i = 0; i < heights.length; i++) {
            if (heights[i] > paragraphHeight && !headlineLevels[heights[i]]) {
                const nextMajorHeight = findNextMajorHeight(heights, i + 1, headlineLevels);
                const distanceToLower = heights[i] - lastMajorHeight;
                const distanceToHigher = nextMajorHeight - heights[i];
                if (distanceToLower <= distanceToHigher) {
                    if (lastMajorHeight == paragraphHeight) {
                        paragraphHeight++;
                    } else {
                        headlineLevels[heights[i]] = headlineLevels[lastMajorHeight];
                    }
                } else {
                    headlineLevels[heights[i]] = headlineLevels[nextMajorHeight];
                }
            }
            if (headlineLevels[heights[i]]) {
                lastMajorHeight = heights[i];
            }
        }

        return pages.map(page => {
            const newTextItems = [];
            page.textItems.forEach(item => {
                if (item.height <= paragraphHeight) {
                    newTextItems.push(item);
                } else {
                    const headlineLevel = headlineLevels[item.height];
                    newTextItems.push(new TextItem({
                        ...item,
                        text: item.text,
                        annotation: new Annotation({
                            category: "Headline " + headlineLevel,
                            color: 'green'
                        }),
                        markdownElement: new Headline({
                            level: headlineLevel
                        })
                    }));
                }
            });
            return {
                ...page,
                textItems: newTextItems
            };
        });
    }

    processAnnotations(pages:PdfPage[]) {
        pages.forEach(page => {
            page.textItems.forEach(textItem => textItem.annotation = null)
        });
        return pages;
    }

}
import Transformation from './Transformation.jsx';
import TextItem from '../TextItem.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';
import Annotation from '../Annotation.jsx';


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

function findNextMajorHeight(heights, currentHeight, headlineMap) {
    for (var i = currentHeight; i < heights.length; i++) {
        if (headlineMap[heights[i]]) {
            return heights[i];
        }
    }
    throw `Shouldn't happen! heights=${heights}, currentHeight=${currentHeight}, headlineMap=${headlineMap}`;
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


        const headlineMap = {};
        headlineHeights.reverse().forEach((height, i) => headlineMap[height] = '#'.repeat(i + 1));
        var lastMajorHeight = paragraphHeight;
        var heights = heightAnalyzation.heights;
        for (var i = 0; i < heights.length; i++) {
            if (heights[i] > paragraphHeight && !headlineMap[heights[i]]) {
                const nextMajorHeight = findNextMajorHeight(heights, i + 1, headlineMap);
                const distanceToLower = heights[i] - lastMajorHeight;
                const distanceToHigher = nextMajorHeight - heights[i];
                if (distanceToLower <= distanceToHigher) {
                    if (lastMajorHeight == paragraphHeight) {
                        paragraphHeight++;
                    } else {
                        headlineMap[heights[i]] = headlineMap[lastMajorHeight];
                    }
                } else {
                    headlineMap[heights[i]] = headlineMap[nextMajorHeight];
                }
            }
            if (headlineMap[heights[i]]) {
                lastMajorHeight = heights[i];
            }
        }

        return pages.map(page => {
            const newTextItems = [];
            page.textItems.forEach(item => {
                if (item.height <= paragraphHeight) {
                    newTextItems.push(item);
                } else {
                    newTextItems.push(new TextItem({
                        ...item,
                        text: item.text,
                        annotation: new Annotation({
                            category: headlineMap[item.height],
                            color: 'green'
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
            page.textItems.forEach(item => {
                if (item.annotation) {
                    item.text = item.annotation.category + ' ' + item.text;
                }
            });
        });
        return pages;
    }

}
import ToTextItemBlockTransformation from './ToTextItemBlockTransformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItemBlock from '../TextItemBlock.jsx';
import { ADDED_ANNOTATION, DETECTED_ANNOTATION } from '../Annotation.jsx';
import ElementType from '../ElementType.jsx';
import { headlineByLevel } from '../ElementType.jsx';

//Detect headlines
export default class DetectHeadlines extends ToTextItemBlockTransformation {

    constructor() {
        super("Detect Headlines");
    }

    transform(parseResult:ParseResult) {
        var foundHeadlines = 0;
        const {mostUsedHeight, mostUsedDistance, maxHeight, tocPages} = parseResult.globals;

        //Set max headlines (all headers on the same page are max level 2)
        const maxHeaderPages = convertMaxHeaders(parseResult.pages, maxHeight, mostUsedHeight);


        var headlineHeightFlowBeforeToc = [];
        var headlineHeightsOccurenceBeforeToc = {};
        var firstPageAfterToc = 0;
        if (tocPages && tocPages.length > 0) {
            [headlineHeightFlowBeforeToc, headlineHeightsOccurenceBeforeToc] = calculateHeadlineHeigthFlow(parseResult.pages, 0, tocPages[0], mostUsedHeight, maxHeaderPages);
            firstPageAfterToc = tocPages[tocPages.length - 1] + 1;
        }

        const [headlineHeightFlowAfterToc, headlineHeightsOccurenceAfterToc] = calculateHeadlineHeigthFlow(parseResult.pages, firstPageAfterToc, parseResult.pages.length, mostUsedHeight, maxHeaderPages);


        // TODO ==> do flow analysis (remove out of flow or snap, start with 2nd)
        // TODO ==> parse seperately between beforeToc and after
        // TODO ==> Kala chakra, all uppercase
        // TODO ==> TOC headlines

        //var topHeadlinePassed = false;
        const headlineHeightMap = {};
        const headlineSizePerLevel = {};
        var currentHeadlineLevel;
        parseResult.pages.forEach(page => {
            const newBlocks = [];
            page.items.forEach(block => {
                newBlocks.push(block);
                if (!block.type && !block.annotation && block.textItems[0].height > mostUsedHeight) {
                    // const combineResult = textCombiner.combine(block.textItems);
                    // if (combineResult.textItems.length == 1) {
                    //     const height = combineResult.textItems[0].height;
                    //     if (height == maxHeight) {
                    //         // block.annotation = REMOVED_ANNOTATION;
                    //         currentHeadlineLevel = 1;
                    //         headlineSizePerLevel[currentHeadlineLevel] = height
                    //         addNewBlock(newBlocks, combineResult, headlineByLevel(currentHeadlineLevel));
                    //     }
                    // else if (currentHeadlineLevel) {
                    //     const currentLevelSize = headlineSizePerLevel[currentHeadlineLevel];
                    //     if (height < currentLevelSize) {
                    //         const nextLevelSize = headlineSizePerLevel[currentHeadlineLevel + 1];
                    //         // if(!nextLevelSize)
                    //         if (currentHeadlineLevel < 6) {
                    //             currentHeadlineLevel++;
                    //         }
                    //         addNewBlock(newBlocks, combineResult, headlineByLevel(currentHeadlineLevel));
                    //         headlineSizePerLevel[currentHeadlineLevel] = height;
                    //     } else if (height > currentLevelSize) {
                    //         const preLevelSize = headlineSizePerLevel[currentHeadlineLevel - 1];
                    //         if (currentHeadlineLevel > 1) {
                    //             currentHeadlineLevel--;
                    //         }
                    //         addNewBlock(newBlocks, combineResult, headlineByLevel(currentHeadlineLevel));
                    //         headlineSizePerLevel[currentHeadlineLevel] = height;
                    //     } else {
                    //         addNewBlock(newBlocks, combineResult, headlineByLevel(currentHeadlineLevel));
                    //     }
                    // }
                    // }
                }
            });
            page.items = newBlocks;
        });

        const heightToOccurrence = {};
        const fontToOccurrence = {};
        // parseResult.content.forEach(page => {
        //     const newBlocks = [];
        //     page.blocks.forEach(block => {
        //         newBlocks.push(block);
        //         if (!block.type && block.textItems[0].height > mostUsedHeight) {
        //             foundHeadlines++;
        //             block.annotation = REMOVED_ANNOTATION;
        //             const combineResult = textCombiner.combine(block.textItems);
        //             const height = combineResult.textItems[0].height;
        //             const font = combineResult.textItems[0].font;
        //             heightToOccurrence[height] = heightToOccurrence[height] ? heightToOccurrence[height] + 1 : 1;
        //             fontToOccurrence[font] = fontToOccurrence[font] ? fontToOccurrence[font] + 1 : 1;
        //             newBlocks.push(new PdfBlock({
        //                 textItems: combineResult.textItems,
        //                 type: HEADLINE1,
        //                 annotation: ADDED_ANNOTATION,
        //                 parsedElements: combineResult.parsedElements
        //             }));
        //         }
        //     });
        //     page.blocks = newBlocks;
        // });

        return new ParseResult({
            ...parseResult,
            messages: [
                'Found headlines: ' + foundHeadlines,
                'Height repetition: ' + JSON.stringify(heightToOccurrence),
                'Font repetition: ' + JSON.stringify(fontToOccurrence),
                'Pages with max Header: ' + maxHeaderPages,
                'Headline Height Flow (before TOC): ' + headlineHeightFlowBeforeToc,
                'Headline Heights Occurence (before TOC): ' + JSON.stringify(headlineHeightsOccurenceBeforeToc),
                'Headline Height Flow: ' + headlineHeightFlowAfterToc,
                'Headline Heights Occurence: ' + JSON.stringify(headlineHeightsOccurenceAfterToc),
            ]
        });
    }

}

function findPagesWithMaxHeight(pages, maxHeight) {
    const maxHeaderPagesSet = new Set();
    pages.forEach(page => {
        page.items.forEach(block => {
            if (!block.type && block.textItems[0].height == maxHeight) {
                maxHeaderPagesSet.add(page);
            }
        });
    });
    return maxHeaderPagesSet;
}
function convertMaxHeaders(pages, maxHeight, mostUsedHeight) {
    // Find pages with max height
    const maxHeaderPagesSet = new Set();
    pages.forEach(page => {
        page.items.forEach(block => {
            if (!block.type && block.textItems[0].height == maxHeight) {
                maxHeaderPagesSet.add(page);
            }
        });
    });

    // Now convert those pages to headlines
    const min2ndLevelHeaderHeigthOnMaxPage = mostUsedHeight + ((maxHeight - mostUsedHeight) / 4);
    maxHeaderPagesSet.forEach(pageWithMaxHeader => {
        pageWithMaxHeader.items.forEach(block => {
            if (block.textItems.length == 1) {
                const height = block.textItems[0].height;
                if (!block.type && height > min2ndLevelHeaderHeigthOnMaxPage) {
                    block.annotation = DETECTED_ANNOTATION;
                    if (height == maxHeight) {
                        block.type = ElementType.H1;
                    } else {
                        block.type = ElementType.H2;
                    }
                }
            }
        });
    });
    return Array.from(maxHeaderPagesSet).map(page => page.index + 1);
}

function calculateHeadlineHeigthFlow(pages, from, to, mostUsedHeight, maxHeaderPages) {
    const headlineHeightFlow = [];
    const headlineHeightsOccurences = {};
    var lastHeadlineHeight;
    for (var i = from; i < to; i++) {
        const page = pages[i];
        if (!maxHeaderPages.includes(page.index + 1)) {
            page.items.forEach(block => {
                if (!block.type && !block.annotation && block.textItems[0].height > mostUsedHeight) {
                    if (block.textItems.length == 1) {
                        const height = block.textItems[0].height;
                        headlineHeightsOccurences[height] = headlineHeightsOccurences[height] ? headlineHeightsOccurences[height] + 1 : 1 ;
                        if (!lastHeadlineHeight || height != lastHeadlineHeight) {
                            headlineHeightFlow.push(height);
                            //headlineFontFlow.push(combineResult.textItems[0].font)
                            lastHeadlineHeight = height;
                        }
                    }
                }
            });
        }
    }

    return [headlineHeightFlow, headlineHeightsOccurences];
}


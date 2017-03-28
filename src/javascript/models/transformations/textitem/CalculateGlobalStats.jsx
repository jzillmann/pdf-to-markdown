import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import WordType from '../../markdown/WordType.jsx';

export default class CalculateGlobalStats extends ToTextItemTransformation {

    constructor(fontMap) {
        super("Calculate Statistics");
        this.fontMap = fontMap;
    }

    transform(parseResult:ParseResult) {
        // Parse heights
        const heightToOccurrence = {};
        const fontToOccurrence = {};
        var maxHeight = 0;
        var maxHeightFont;
        parseResult.pages.forEach(page => {
            page.items.forEach(item => {
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
        parseResult.pages.forEach(page => {
            var lastItemOfMostUsedHeight;
            page.items.forEach(item => {
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


        const fontIdToName = [];
        const fontToFormats = new Map();
        this.fontMap.forEach(function(value, key) {
            fontIdToName.push(key + " = " + value.name)
            const fontName = value.name.toLowerCase();
            var type;
            if (key == mostUsedFont) {
                type = null;
            } else if (fontName.includes('bold') && (fontName.includes('oblique') || fontName.includes('italic'))) {
                type = WordType.BOLD_OBLIQUE;
            } else if (fontName.includes('bold')) {
                type = WordType.BOLD;
            } else if (fontName.includes('oblique') || fontName.includes('italic')) {
                type = WordType.OBLIQUE;
            } else if (fontName === maxHeightFont) {
                type = WordType.BOLD;
            }
            if (type) {
                fontToFormats.set(key, type);
            }
        });
        fontIdToName.sort();



        //Make a copy of the originals so all following transformation don't modify them
        const newPages = parseResult.pages.map(page => {
            return {
                ...page,
                items: page.items.map(textItem => {
                    return {
                        ...textItem,
                    }
                })
            };
        });
        return new ParseResult({
            ...parseResult,
            pages: newPages,
            globals: {
                mostUsedHeight: mostUsedHeight,
                mostUsedFont: mostUsedFont,
                mostUsedDistance: mostUsedDistance,
                maxHeight: maxHeight,
                maxHeightFont: maxHeightFont,
                fontToFormats: fontToFormats
            },
            messages: [
                'Items per height: ' + JSON.stringify(heightToOccurrence),
                'Items per font: ' + JSON.stringify(fontToOccurrence),
                'Items per distance: ' + JSON.stringify(distanceToOccurrence),
                'Fonts:' + JSON.stringify(fontIdToName)
            ]
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
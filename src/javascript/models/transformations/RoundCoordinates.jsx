import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';

export default class RoundCoordinates extends ToPdfViewTransformation {

    constructor() {
        super("Round Coordinates");
    }

    transform(parseResult:ParseResult) {
        const newContent = parseResult.content.map(pdfPage => {
            return {
                ...pdfPage,
                textItems: pdfPage.textItems.map(textItem => {
                    return {
                        ...textItem,
                        x: Math.round(textItem.x),
                        y: Math.round(textItem.y),
                        width: Math.round(textItem.width),
                        height: Math.round(textItem.height)
                    }
                })
            };
        });
        return new ParseResult({
            ...parseResult,
            content: newContent,
        });
    }

}
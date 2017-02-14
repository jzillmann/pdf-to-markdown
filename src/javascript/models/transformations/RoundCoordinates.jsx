import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import PdfPage from '../PdfPage.jsx';

export default class RoundCoordinates extends ToPdfViewTransformation {

    constructor() {
        super("Round Coordinates");
    }

    transform(pdfPages:PdfPage[]) {
        return pdfPages.map(pdfPage => {
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
    }

}
import Transformation from './Transformation.jsx';
import PdfPage from '../PdfPage.jsx';

export default class RoundCoordinatesTransformation extends Transformation {

    constructor() {
        super("Round coordinates");
    }

    transform(pdfPage:PdfPage) {
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
    }

}
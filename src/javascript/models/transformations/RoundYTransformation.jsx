import Transformation from './Transformation.jsx';

export default class RoundYTransformation extends Transformation {

    constructor() {
        super("Round all Y");
    }

    transform(pdfPage:PdfPage) {
        return {
            ...pdfPage,
            textItems: pdfPage.textItems.map(textItem => {
                return {
                    ...textItem,
                    y: Math.round(textItem.y)
                }
            })
        };
    }

}
import Transformation from './Transformation.jsx';

export default class NoOpTransformation extends Transformation {

    constructor() {
        super("Original");
    }

    transform(pdfPage:PdfPage) {
        return pdfPage;
    }

}
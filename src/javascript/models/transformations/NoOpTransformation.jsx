import Transformation from './Transformation.jsx';
import PdfPage from '../PdfPage.jsx';

export default class NoOpTransformation extends Transformation {

    constructor() {
        super("Original");
    }

    transform(pdfPage:PdfPage) {
        return pdfPage;
    }

}
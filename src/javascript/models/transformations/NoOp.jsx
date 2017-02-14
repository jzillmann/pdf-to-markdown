import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import PdfPage from '../PdfPage.jsx';

export default class NoOp extends ToPdfViewTransformation {

    constructor() {
        super("Original");
    }

    transform(pdfPages:PdfPage[]) {
        return pdfPages;
    }

}
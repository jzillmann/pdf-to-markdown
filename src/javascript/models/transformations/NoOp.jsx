import Transformation from './Transformation.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';

export default class NoOp extends Transformation {

    constructor() {
        super("Original");
    }

    contentView() {
        return ContentView.PDF;
    }

    transform(pdfPages:PdfPage[]) {
        return pdfPages;
    }

}
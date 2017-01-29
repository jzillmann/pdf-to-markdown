import Transformation from './Transformation.jsx';
import PdfPage from '../PdfPage.jsx';
import TextPage from '../TextPage.jsx';
import ContentView from '../ContentView.jsx';

export default class ToTextPages extends Transformation {

    constructor() {
        super("To Text Pages");
    }

    contentView() {
        return ContentView.TEXT;
    }

    transform(pdfPages:PdfPage[]) {
        return pdfPages.map(pdfPage => {
            var text = '';
            pdfPage.textItems.forEach(textItem => text += textItem.text + '\n');
            return new TextPage({
                index: pdfPage.index,
                text: text
            });
        });
    }

}
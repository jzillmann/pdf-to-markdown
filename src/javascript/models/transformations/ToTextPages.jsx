import Transformation from './Transformation.jsx';
import PdfPage from '../PdfPage.jsx';
import TextPage from '../TextPage.jsx';
import ContentView from '../ContentView.jsx';

function itemIsSameMarkdownElement(item1, item2) {
    if (!item1.markdownElement || !item2.markdownElement) {
        return false;
    }
    return item1.markdownElement.constructor.name === item2.markdownElement.constructor.name;
}

export default class ToTextPages extends Transformation {

    constructor() {
        super("To Text Pages");
    }

    contentView() {
        return ContentView.TEXT;
    }

    transform(pdfPages:PdfPage[]) {
        return pdfPages.map(page => {
            var text = '';
            page.textItems.forEach((textItem, i) => {
                if (textItem.markdownElement) {
                    if (i > 0 && textItem.markdownElement.newLineBefore && !itemIsSameMarkdownElement(textItem, page.textItems[i - 1])) {
                        text += '\n'
                    }
                    text += textItem.markdownElement.transformText(textItem.text) + '\n'
                    if (textItem.markdownElement.newLineAfter && (i == page.textItems.length - 1 || !itemIsSameMarkdownElement(textItem, page.textItems[i + 1]))) {
                        text += '\n'
                    }
                } else {
                    text += textItem.text + '\n'
                }
            });
            return new TextPage({
                index: page.index,
                text: text
            });
        });
    }

}
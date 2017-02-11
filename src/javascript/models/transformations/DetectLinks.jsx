import Transformation from './Transformation.jsx';
import TextItem from '../TextItem.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';

import Annotation from '../Annotation.jsx';

export default class DetectLinks extends Transformation {

    constructor() {
        super("Detect Links");
    }

    contentView() {
        return ContentView.PDF;
    }

    transform(pages:PdfPage[]) {
        const addedAnnotation = new Annotation({
            category: 'added',
            color: 'green'
        });
        const removedAnnotation = new Annotation({
            category: 'removed',
            color: 'red'
        });

        pages.forEach(page => {
            const newTextItems = [];
            page.textItems.forEach(item => {
                newTextItems.push(item);
                var words = item.text.split(' ');
                var changedWords = [];
                var change = false;
                words.forEach(word => {
                    if (word.startsWith('http:')) {
                        changedWords.push(`[${word}](${word})`);
                        change = true;
                    } else if (word.startsWith('www.')) {
                        changedWords.push(`[http://${word}](http://${word})`);
                        change = true;
                    } else {
                        changedWords.push(word);
                    }
                });
                if (change) {
                    newTextItems.push(new TextItem({
                        ...item,
                        text: changedWords.join(' '),
                        annotation: addedAnnotation,
                    }));
                    item.annotation = removedAnnotation;
                }
            });
            page.textItems = newTextItems;
        });
        return pages;
    }

    processAnnotations(pages:PdfPage[]) {
        pages.forEach(page => {
            page.textItems = page.textItems.filter(textItem => !textItem.annotation || textItem.annotation.category !== 'removed');
            page.textItems.forEach(textItem => textItem.annotation = null)
        });
        return pages;
    }

}
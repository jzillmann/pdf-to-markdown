import Transformation from './Transformation.jsx';
import TextItem from '../TextItem.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';
import Annotation from '../Annotation.jsx';

export default class CombineSameYTransformation extends Transformation {

    constructor() {
        super("Combine Text On Same Y");
    }

    contentView() {
        return ContentView.PDF;
    }

    transform(pages:PdfPage[]) {

        const removedAnnotation = new Annotation({
            category: 'removed',
            color: 'red'
        });
        const combinedAnnotation = new Annotation({
            category: 'combined',
            color: 'green'
        });

        return pages.map(pdfPage => {
            const newTextItems = [];
            var lastTextItem;
            pdfPage.textItems.forEach(textItem => {
                if (!lastTextItem) {
                    lastTextItem = textItem;
                } else {
                    if (textItem.y == lastTextItem.y) { //combine

                        if (!lastTextItem.annotation) {
                            lastTextItem.annotation = removedAnnotation;
                            newTextItems.push(lastTextItem);
                        }
                        textItem.annotation = removedAnnotation;
                        newTextItems.push(textItem);

                        var combinedText = lastTextItem.text;
                        //TODO make 5 dependent on text size or biggest gap?
                        if (textItem.x - lastTextItem.x - lastTextItem.width > 7) {
                            combinedText += ' ';
                        }
                        combinedText += textItem.text;

                        lastTextItem = new TextItem({
                            x: lastTextItem.x,
                            y: lastTextItem.y,
                            width: textItem.x - lastTextItem.x + textItem.width,
                            height: lastTextItem.height, //might this cause problems ?
                            text: combinedText,
                            annotation: combinedAnnotation
                        });
                    } else { //rotate
                        newTextItems.push(lastTextItem);
                        lastTextItem = textItem;
                    }
                }
            });
            if (lastTextItem) {
                newTextItems.push(lastTextItem);
            }

            return {
                ...pdfPage,
                textItems: newTextItems
            };
        });
    }

    processAnnotations(pages:PdfPage[]) {
        pages.forEach(page => {
            page.textItems = page.textItems.filter(textItem => !textItem.annotation || textItem.annotation.category !== 'removed');
            page.textItems.forEach(textItem => textItem.annotation = null)
        });
        return pages;
    }

}
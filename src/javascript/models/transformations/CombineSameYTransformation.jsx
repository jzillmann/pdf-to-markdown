import Transformation from './Transformation.jsx';
import TextItem from '../TextItem.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';

export default class CombineSameYTransformation extends Transformation {

    constructor() {
        super("Combine text on same Y");
    }

    contentView() {
        return ContentView.PDF;
    }

    transform(pages:PdfPage[]) {
        return pages.map(pdfPage => {
            const newTextItems = [];
            var lastTextItem;
            pdfPage.textItems.forEach(textItem => {
                if (!lastTextItem) {
                    lastTextItem = textItem;
                } else {
                    if (textItem.y == lastTextItem.y) {
                        //combine

                        // console.debug("last=" + lastTextItem.text + ", x=" + lastTextItem.x + ", width=" + lastTextItem.width);
                        // console.debug("new=" + textItem.text + ", x=" + textItem.x + ", width=" + textItem.width);
                        // console.debug("diff=" + (textItem.x - lastTextItem.x - lastTextItem.width));

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
                            text: combinedText
                        });
                    } else {
                        //rotate
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

}
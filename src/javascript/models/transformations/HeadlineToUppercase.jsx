import Transformation from './Transformation.jsx';
import TextItem from '../TextItem.jsx';
import PdfPage from '../PdfPage.jsx';
import ContentView from '../ContentView.jsx';
import Annotation from '../Annotation.jsx';

import { hasUpperCaseCharacterInMiddleOfWord } from '../../functions.jsx'

// Uppercase headlines are often parsed with very mixed character with pdf.js, like 'A heAdLine'.
// This tries to detect them and make them all uppercase.
export default class HeadlineToUppercase extends Transformation {

    constructor() {
        super("Headlines Uppercase");
    }

    contentView() {
        return ContentView.PDF;
    }

    transform(pages:PdfPage[]) {


        return pages.map(page => {
            const newTextItems = [];
            page.textItems.forEach(item => {
                if (item.markdownElement && item.markdownElement.constructor.name === 'Headline') {
                    const headline = item.text.trim();
                    if (hasUpperCaseCharacterInMiddleOfWord(headline)) {
                        item.annotation = new Annotation({
                            category: 'removed',
                            color: 'red'
                        });
                        newTextItems.push(item);
                        newTextItems.push(new TextItem({
                            ...item,
                            text: item.text.toUpperCase(),
                            annotation: new Annotation({
                                category: "Uppercased",
                                color: 'green'
                            })
                        }));
                    } else {
                        item.annotation = new Annotation({
                            category: 'Untouched',
                            color: 'brown'
                        });
                        newTextItems.push(item);
                    }
                } else {
                    newTextItems.push(item);
                }
            });
            return {
                ...page,
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
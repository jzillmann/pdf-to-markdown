import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import TextItem from '../TextItem.jsx';
import PdfPage from '../PdfPage.jsx';
import { ADDED_ANNOTATION, REMOVED_ANNOTATION, UNCHANGED_ANNOTATION } from '../Annotation.jsx';

import { hasUpperCaseCharacterInMiddleOfWord } from '../../functions.jsx'

// Uppercase headlines are often parsed with very mixed character with pdf.js, like 'A heAdLine'.
// This tries to detect them and make them all uppercase.
export default class HeadlineToUppercase extends ToPdfViewTransformation {

    constructor() {
        super("Headlines Uppercase");
    }

    transform(pages:PdfPage[]) {


        return pages.map(page => {
            const newTextItems = [];
            page.textItems.forEach(item => {
                if (item.markdownElement && item.markdownElement.constructor.name === 'Headline') {
                    const headline = item.text.trim();
                    if (hasUpperCaseCharacterInMiddleOfWord(headline)) {
                        item.annotation = REMOVED_ANNOTATION;
                        newTextItems.push(item);
                        newTextItems.push(new TextItem({
                            ...item,
                            text: item.text.toUpperCase(),
                            annotation: ADDED_ANNOTATION
                        }));
                    } else {
                        item.annotation = UNCHANGED_ANNOTATION;
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
            page.textItems = page.textItems.filter(textItem => !textItem.annotation || textItem.annotation !== REMOVED_ANNOTATION);
            page.textItems.forEach(textItem => textItem.annotation = null)
        });
        return pages;
    }

}
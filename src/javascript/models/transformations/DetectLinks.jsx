import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import TextItem from '../TextItem.jsx';
import ParseResult from '../ParseResult.jsx';

import { ADDED_ANNOTATION, REMOVED_ANNOTATION } from '../Annotation.jsx';

export default class DetectLinks extends ToPdfViewTransformation {

    constructor() {
        super("Detect Links");
    }

    transform(parseResult:ParseResult) {
        parseResult.content.forEach(page => {
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
                        annotation: ADDED_ANNOTATION,
                    }));
                    item.annotation = REMOVED_ANNOTATION;
                }
            });
            page.textItems = newTextItems;
        });
        return parseResult;
    }

    completeTransform(parseResult:ParseResult) {
        parseResult.content.forEach(page => {
            page.textItems = page.textItems.filter(textItem => !textItem.annotation || textItem.annotation !== REMOVED_ANNOTATION);
            page.textItems.forEach(textItem => textItem.annotation = null)
        });
        return parseResult;
    }

}
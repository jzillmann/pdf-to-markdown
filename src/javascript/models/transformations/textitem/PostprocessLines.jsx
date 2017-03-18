import ToTextItemTransformation from '../ToTextItemTransformation.jsx';
import ParseResult from '../../ParseResult.jsx';
import TextItem from '../../TextItem.jsx';
import { ParsedElements } from '../../PageItem.jsx';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../../Annotation.jsx';


// Remove whitespace, detect links, etc...
export default class PostprocessLines extends ToTextItemTransformation {

    constructor() {
        super("Remove Whitespace & Detect Links");
        this.showWhitespaces = true;
    }

    transform(parseResult:ParseResult) {
        var strippedWhitespace = 0;
        var foundLinks = 0;

        parseResult.pages.forEach(page => {
            const newItems = [];
            page.items.forEach(lineItem => {
                newItems.push(lineItem);
                var words = lineItem.text.split(' ');
                var newWords = [];
                var foundSuperflousNewLine = false;
                var foundLink = false;
                words.forEach(word => {
                    if (word.trim().length == 0) {
                        foundSuperflousNewLine = true;
                        strippedWhitespace++;
                    } else {
                        if (word.startsWith('http:')) {
                            foundLinks++;
                            foundLink = true;
                            newWords.push(`[${word}](${word})`);
                        } else if (word.startsWith('www.')) {
                            foundLinks++;
                            foundLink = true;
                            newWords.push(`[http://${word}](http://${word})`);
                        } else {
                            newWords.push(word);
                        }
                    }
                });
                if (foundSuperflousNewLine || foundLink) {
                    lineItem.annotation = REMOVED_ANNOTATION;
                    if (newWords.length > 0) {
                        newItems.push(new TextItem({
                            ...lineItem,
                            text: newWords.join(' '),
                            annotation: ADDED_ANNOTATION,
                            parsedElements: new ParsedElements({
                                ...lineItem.parsedElements,
                                containLinks: foundLink
                            })
                        }));
                    }
                }
            });
            page.items = newItems;
        });


        return new ParseResult({
            ...parseResult,
            messages: [
                'Stripped ' + strippedWhitespace + ' superflous whitespaces',
                'Found ' + foundLinks + ' links',
            ]
        });
    }


}

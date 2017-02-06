import Transformation from './Transformation.jsx';
import TextPage from '../TextPage.jsx';
import ContentView from '../ContentView.jsx';

export default class ToMarkdown extends Transformation {

    constructor() {
        super("To Markdown");
    }

    showPageSelection() {
        return false;
    }

    contentView() {
        return ContentView.MARKDOWN;
    }

    transform(pages:TextPage[]) {
        var text = '';
        pages.forEach(page => text += page.text + '\n');
        return [new TextPage({
            index: 0,
            text: text
        })];
    }

}
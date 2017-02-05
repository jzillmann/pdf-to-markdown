import MarkdownElement from './MarkdownElement.jsx';

export default class Headline extends MarkdownElement {

    constructor(options) {
        super({
            newLineBefore: true,
            newLineAfter: true
        });
        this.level = options.level;
    }

    transformText(text) { 
        return '#'.repeat(this.level) + ' ' + text;
    }

}

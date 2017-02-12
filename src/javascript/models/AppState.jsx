import { Enum } from 'enumify';

import NoOp from './transformations/NoOp.jsx';
import RoundCoordinates from './transformations/RoundCoordinates.jsx';
import CombineSameY from './transformations/CombineSameY.jsx';
import RemoveWhitespaces from './transformations/RemoveWhitespaces.jsx'
import DetectFootnotes from './transformations/DetectFootnotes.jsx'
import DetectLinks from './transformations/DetectLinks.jsx'
import RemoveRepetitiveElements from './transformations/RemoveRepetitiveElements.jsx'
import HeadlineDetector from './transformations/HeadlineDetector.jsx'
import HeadlineToUppercase from './transformations/HeadlineToUppercase.jsx'
import ToBlockSystem from './transformations/ToBlockSystem.jsx';
import ToMarkdown from './transformations/ToMarkdown.jsx'

// Holds the state of the Application
export default class AppState {

    constructor(options) {
        this.renderFunction = options.renderFunction;
        this.mainView = View.UPLOAD;
        this.fileBuffer;
        this.pdfPages = [];
        this.transformations = [
            new NoOp,
            new RoundCoordinates(),
            new CombineSameY(),
            new RemoveWhitespaces(),
            new DetectFootnotes(),
            new DetectLinks(),
            new RemoveRepetitiveElements(),
            new HeadlineDetector(),
            new HeadlineToUppercase(),
            new ToBlockSystem(),
            new ToMarkdown()];

        //bind functions
        this.render = this.render.bind(this);
        this.storeFileBuffer = this.storeFileBuffer.bind(this);
        this.storePdfPages = this.storePdfPages.bind(this);
        this.switchMainView = this.switchMainView.bind(this);
    }

    render() {
        this.renderFunction(this)
    }

    // the uploaded pdf as file buffer
    storeFileBuffer(fileBuffer:ArrayBuffer) {
        this.fileBuffer = fileBuffer;
        this.mainView = View.LOADING;
        this.render()
    }

    storePdfPages(pdfPages) {
        this.pdfPages = pdfPages;
        this.fileBuffer = null;
        this.mainView = View.RESULT;
        this.render();
    }

    switchMainView(view) {
        this.mainView = view;
        this.render();
    }

}

export class View extends Enum {
}
View.initEnum(['UPLOAD', 'LOADING', 'RESULT', 'DEBUG'])
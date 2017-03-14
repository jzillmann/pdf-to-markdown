import { Enum } from 'enumify';

import CalculateGlobalStats from './transformations/CalculateGlobalStats.jsx';
import CompactLines from './transformations/CompactLines.jsx';
import RemoveRepetitiveElements from './transformations/RemoveRepetitiveElements.jsx'
import VerticalToHorizontal from './transformations/VerticalToHorizontal.jsx';
import DetectTOC from './transformations/DetectTOC.jsx'
import DetectListItems from './transformations/DetectListItems.jsx'

import GatherBlocks from './transformations/GatherBlocks.jsx'
import DetectCodeQuoteBlocks from './transformations/DetectCodeQuoteBlocks.jsx'
import DetectListLevels from './transformations/DetectListLevels.jsx'
import DetectHeadlines from './transformations/DetectHeadlines.jsx'
// import DetectFormats from './transformations/DetectFormats.jsx'
// import RemoveWhitespaces from './transformations/RemoveWhitespaces.jsx'
// import DetectLinks from './transformations/DetectLinks.jsx'
// import HeadlineDetector from './transformations/HeadlineDetector.jsx'
// import HeadlineToUppercase from './transformations/HeadlineToUppercase.jsx'
import ToTextBlocks from './transformations/ToTextBlocks.jsx';
import ToMarkdown from './transformations/ToMarkdown.jsx'

// Holds the state of the Application
export default class AppState {

    constructor(options) {
        this.renderFunction = options.renderFunction;
        this.mainView = View.UPLOAD;
        this.fileBuffer;
        this.pages = [];
        this.transformations = [
            new CalculateGlobalStats(),
            new CompactLines(),
            new RemoveRepetitiveElements(),
            new VerticalToHorizontal(),
            new DetectTOC(),
            new DetectListItems(),

            new GatherBlocks(),
            new DetectCodeQuoteBlocks(),
            new DetectListLevels(),
            new DetectHeadlines(),

            // new DetectFormats(),
            // new RemoveWhitespaces(),
            // new DetectLinks(),
            // new HeadlineDetector(),
            // new HeadlineToUppercase(),
            new ToTextBlocks(),
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

    storePdfPages(pages) {
        this.pages = pages;
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
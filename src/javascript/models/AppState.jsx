import { Enum } from 'enumify';

import CalculateGlobalStats from './transformations/textitem/CalculateGlobalStats.jsx';

import CompactLines from './transformations/textitem/CompactLines.jsx';
import RemoveRepetitiveElements from './transformations/textitem/RemoveRepetitiveElements.jsx'
import VerticalToHorizontal from './transformations/textitem/VerticalToHorizontal.jsx';
import DetectTOC from './transformations/textitem/DetectTOC.jsx'
import DetectListItems from './transformations/textitem/DetectListItems.jsx'
import DetectHeaders from './transformations/textitem/DetectHeaders.jsx'

import GatherBlocks from './transformations/textitemblock/GatherBlocks.jsx'
import DetectCodeQuoteBlocks from './transformations/textitemblock/DetectCodeQuoteBlocks.jsx'
import DetectListLevels from './transformations/textitemblock/DetectListLevels.jsx'
import ToTextBlocks from './transformations/ToTextBlocks.jsx';
import ToMarkdown from './transformations/ToMarkdown.jsx'

// Holds the state of the Application
export default class AppState {

    constructor(options) {
        this.renderFunction = options.renderFunction;
        this.mainView = View.UPLOAD;
        this.fileBuffer;
        this.metadata;
        this.pages = [];
        this.transformations ;

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

    storePdfPages(metadata, fontMap, pages) {
        this.metadata = metadata;
        this.pages = pages;
        this.fileBuffer = null;
        this.mainView = View.RESULT;

        this.transformations = [
            new CalculateGlobalStats(fontMap),
            new CompactLines(),
            new RemoveRepetitiveElements(),
            new VerticalToHorizontal(),
            new DetectTOC(),
            new DetectHeaders(),
            new DetectListItems(),

            new GatherBlocks(),
            new DetectCodeQuoteBlocks(),
            new DetectListLevels(),

            new ToTextBlocks(),
            new ToMarkdown()];

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
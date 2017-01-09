import { Enum } from 'enumify';

import NoOpTransformation from './transformations/NoOpTransformation.jsx';
import RoundCoordinatesTransformation from './transformations/RoundCoordinatesTransformation.jsx';
import CombineSameYTransformation from './transformations/CombineSameYTransformation.jsx';

// Holds the state of the Application
export default class AppState {

    constructor(options) {
        this.renderFunction = options.renderFunction;
        this.mainView = View.UPLOAD;
        this.fileBuffer;
        this.pdfPages = [];
        this.transformations = [new NoOpTransformation(), new RoundCoordinatesTransformation(), new CombineSameYTransformation()];

        //bind functions
        this.render = this.render.bind(this);
        this.storeFileBuffer = this.storeFileBuffer.bind(this);
        this.storePdfPages = this.storePdfPages.bind(this);
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
        this.mainView = View.PDF_VIEW;
        this.render();
    }

}

export class View extends Enum {
}
View.initEnum(['UPLOAD', 'LOADING', 'PDF_VIEW'])
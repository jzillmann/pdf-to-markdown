import { Enum } from 'enumify';
import { makeTransformations } from '../lib/transformations.jsx';

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
    storeFileBuffer(fileBuffer:Uint8Array) {
        this.fileBuffer = fileBuffer;
        this.mainView = View.LOADING;
        this.render()
    }

    storePdfPages(metadata, fontMap, pages) {
        this.metadata = metadata;
        this.pages = pages;
        this.fileBuffer = null;
        this.mainView = View.RESULT;

        this.transformations = makeTransformations(fontMap);

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

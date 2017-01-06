import { Enum } from 'enumify';

import { pdfToTextItemsAsync } from '../functions/pdfToTextItems.jsx'
import PdfPage from './PdfPage.jsx';

// Holds the state of the Application
export default class AppState {

    constructor(options) {
        this.renderFunction = options.renderFunction;
        this.mainView = View.UPLOAD;
        this.pagesToUpload = 0;
        this.uploadedPages = 0;
        this.pdfPages = [];

        //bind functions
        this.render = this.render.bind(this);
        this.uploadPdf = this.uploadPdf.bind(this);
        this.setPageCount = this.setPageCount.bind(this);
        this.setPdfPage = this.setPdfPage.bind(this);
    }

    render() {
        this.renderFunction(this)
    }

    uploadPdf(fileBuffer:ArrayBuffer) {
        pdfToTextItemsAsync(fileBuffer, this);
        this.mainView = View.LOADING;
        this.render()
    }

    setPageCount(numPages) {
        this.pagesToUpload = numPages;
        for (var i = 0; i < numPages; i++) {
            this.pdfPages.push(new PdfPage({
                index: i
            }));
        }
    }

    setPdfPage(pageIndex, textItems) {
        console.debug("Upload " + pageIndex);
        this.pdfPages[pageIndex].textItems = textItems;
        this.uploadedPages++;
        if (this.uploadedPages == this.pagesToUpload) {
            console.debug("Fin");
            this.mainView = View.PDF_VIEW;
            this.render();
        }
    }

}

export class View extends Enum {
}
View.initEnum(['UPLOAD', 'LOADING', 'PDF_VIEW'])
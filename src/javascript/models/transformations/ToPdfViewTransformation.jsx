import React from 'react';
import Transformation from './Transformation.jsx';
import PdfPage from '../PdfPage.jsx';
import PdfPageView from '../../components/debug/PdfPageView.jsx';

// Abstract pdfView transformation
export default class ToPdfViewTransformation extends Transformation {

    constructor(name) {
        super(name);
        if (this.constructor === ToPdfViewTransformation) {
            throw new TypeError("Can not construct abstract class.");
        }
        this.showWhitespaces = false;
    }

    showPageSelection() {
        return true;
    }

    showModificationCheckbox() {
        return true;
    }

    createPageView(page, modificationsOnly) {
        return <PdfPageView
                            key={ page.index }
                            pdfPage={ page }
                            modificationsOnly={ modificationsOnly }
                            showWhitespaces={ this.showWhitespaces } />;
    }

    transform(pdfPages:PdfPage[]) {
        return pdfPages;
    }

}
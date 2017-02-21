import React from 'react';
import Transformation from './Transformation.jsx';
import ParseResult from '../ParseResult.jsx';
import PdfPageView from '../../components/debug/PdfPageView.jsx';
import { REMOVED_ANNOTATION } from '../Annotation.jsx';

// Abstract class for transformations producing a PdfPage to be shown in the PdfView
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

    completeTransform(parseResult:ParseResult) {
        // The usual cleanup
        parseResult.messages = [];
        parseResult.content.forEach(page => {
            page.textItems = page.textItems.filter(item => !item.annotation || item.annotation !== REMOVED_ANNOTATION);
            page.textItems.forEach(block => block.annotation = null);
        });
        return parseResult;
    }


}
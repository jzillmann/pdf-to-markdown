import React from 'react';
import Transformation from './Transformation.jsx';
import ParseResult from '../ParseResult.jsx';
import PdfBlockPageView from '../../components/debug/PdfBlockPageView.jsx';
import { REMOVED_ANNOTATION } from '../Annotation.jsx';

// Abstract class for transformations producing a PdfBlockPage to be shown in the PdfBlockView
export default class ToPdfBlockViewTransformation extends Transformation {

    constructor(name) {
        super(name);
        if (this.constructor === ToPdfBlockViewTransformation) {
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
        return <PdfBlockPageView
                                 key={ page.index }
                                 pdfPage={ page }
                                 modificationsOnly={ modificationsOnly }
                                 showWhitespaces={ this.showWhitespaces } />;
    }

    completeTransform(parseResult:ParseResult) {
        // The usual cleanup
        parseResult.messages = [];
        parseResult.content.forEach(page => {
            page.blocks = page.blocks.filter(block => !block.annotation || block.annotation !== REMOVED_ANNOTATION);
            page.blocks.forEach(block => block.annotation = null);
        });
        return parseResult;
    }

}
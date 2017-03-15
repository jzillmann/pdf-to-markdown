import React from 'react';
import Transformation from './Transformation.jsx';
import ParseResult from '../ParseResult.jsx';
import TextItemBlock from '../TextItemBlock.jsx';
import TextItemBlockPageView from '../../components/debug/TextItemBlockPageView.jsx';
import { REMOVED_ANNOTATION } from '../Annotation.jsx';

// Abstract class for transformations producing TextItemBlock(s) to be shown in the TextItemBlockPageView
export default class ToTextItemBlockTransformation extends Transformation {

    constructor(name) {
        super(name, TextItemBlock.name);
        if (this.constructor === ToTextItemBlockTransformation) {
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
        return <TextItemBlockPageView
                                      key={ page.index }
                                      page={ page }
                                      modificationsOnly={ modificationsOnly }
                                      showWhitespaces={ this.showWhitespaces } />;
    }

    completeTransform(parseResult:ParseResult) {
        // The usual cleanup
        parseResult.messages = [];
        parseResult.pages.forEach(page => {
            page.items = page.items.filter(item => !item.annotation || item.annotation !== REMOVED_ANNOTATION);
            page.items.forEach(item => item.annotation = null);
        });
        return parseResult;
    }

}
import React from 'react';
import PageView from './PageView.jsx';
import TextItemTable from './TextItemTable.jsx';

// View for a Page which items are of kind TextItemBlock
export default class TextItemBlockPageView extends PageView {

    createItemViews(items, showWhitespaces) {
        const blockTables = items.map((block, i) => {
            var textItems = block.textItems;
            const blockType = block.type ? ' - ' + block.type : null;
            const blockAnnotation = block.annotation ? <span>{ ' - ' + block.annotation.category }</span>
                : null;
            const borderStyle = block.annotation ? {
                marginBottom: "20px",
                border: "solid thin " + block.annotation.color
            } : null;
            const colorStyle = block.annotation ? {
                color: block.annotation.color
            } : null;
            var footnoteLinks;
            var footnotes;
            if (block.parsedElements) {
                if (block.parsedElements.footnoteLinks.length > 0) {
                    footnoteLinks = <div>
                                      { 'Footnote-Links: ' + block.parsedElements.footnoteLinks }
                                    </div>;
                }
                if (block.parsedElements.footnotes.length > 0) {
                    footnotes = <div>
                                  { 'Footnotes: ' + block.parsedElements.footnotes }
                                </div>;
                }
            }

            return <div key={ i }>
                     <div style={ colorStyle }>
                       <b>Block { i + 1 }</b><i>{ blockType } { blockAnnotation }</i>
                     </div>
                     <div style={ borderStyle }>
                       <TextItemTable textItems={ textItems } showWhitespaces={ showWhitespaces } />
                       { footnoteLinks }
                       { footnotes }
                     </div>
                   </div>
        });
        return blockTables;
    }

}
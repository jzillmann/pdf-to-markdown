import React from 'react';
import TextItemTable from './TextItemTable.jsx';

// View for a PdfBlockPage
export default class PdfBlockPageView extends React.Component {

    static propTypes = {
        pdfPage: React.PropTypes.object.isRequired,
        modificationsOnly: React.PropTypes.bool.isRequired,
        showWhitespaces: React.PropTypes.bool
    };

    render() {
        const {pdfPage, modificationsOnly, showWhitespaces} = this.props;

        var blocks = pdfPage.blocks;
        if (modificationsOnly) {
            blocks = blocks.filter(block => block.annotation);
        }

        const blockTables = blocks.map((block, i) => {
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

        var content;
        if (blocks.length == 0 && modificationsOnly) {
            content = <div/>
        } else {
            const header = "Page " + (pdfPage.index + 1);
            content = <div>
                        <h2>{ header }</h2>
                        { blockTables }
                      </div>
        }
        return (
            content
            );
    }
}
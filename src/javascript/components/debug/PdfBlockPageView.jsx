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
        var numberOfNonEmptyBlocks = 0;
        const blockTables = pdfPage.blocks.map((block, i) => {
            var textItems = block.textItems;
            if (modificationsOnly) {
                textItems = textItems.filter(item => item.annotation);
            }
            if (textItems.length == 0 && modificationsOnly) {
                return <div key={ i } />
            } else {
                numberOfNonEmptyBlocks++;
                return <div key={ i }>
                         <h4>Block { i + i }</h4>
                         <TextItemTable textItems={ textItems } showWhitespaces={ showWhitespaces } />
                       </div>
            }
        });

        var content;
        if (numberOfNonEmptyBlocks == 0 && modificationsOnly) {
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
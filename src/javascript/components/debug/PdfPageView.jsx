import React from 'react';
import TextItemTable from './TextItemTable.jsx';

// View for a PdfPage
export default class PdfPageView extends React.Component {

    static propTypes = {
        pdfPage: React.PropTypes.object.isRequired,
        modificationsOnly: React.PropTypes.bool.isRequired,
        showWhitespaces: React.PropTypes.bool
    };

    render() {
        const {pdfPage, modificationsOnly, showWhitespaces} = this.props;
        const header = "Page " + (pdfPage.index + 1);
        var textItems = pdfPage.textItems;
        if (modificationsOnly) {
            textItems = textItems.filter(item => item.annotation);
        }

        var content;
        if (textItems.length == 0 && modificationsOnly) {
            content = <div/>
        } else {
            content = <div>
                        <h2>{ header }</h2>
                        <TextItemTable textItems={ textItems } showWhitespaces={ showWhitespaces } />
                      </div>
        }

        return (
            content
            );
    }
}
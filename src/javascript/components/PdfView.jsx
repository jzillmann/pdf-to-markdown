import React from 'react';

import PdfPageView from './PdfPageView.jsx';

// A view which displays the TextItems of multiple PdfPages
export default class PdfView extends React.Component {

    static propTypes = {
        pdfPages: React.PropTypes.array.isRequired,
    };

    render() {
        console.debug(this.props.pdfPages);
        const header = "Parsed " + this.props.pdfPages.length + " pages!"
        return (
            <div>
              <div>
                { header }
              </div>
              <hr/>
              { this.props.pdfPages.map((page) => <PdfPageView key={ page.index } pdfPage={ page } />) }
            </div>
            );
    }
}
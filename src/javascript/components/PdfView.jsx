import React from 'react';

import Badge from 'react-bootstrap/lib/Badge'

import PdfPageView from './PdfPageView.jsx';

// A view which displays the TextItems of multiple PdfPages
export default class PdfView extends React.Component {

    static propTypes = {
        pdfPages: React.PropTypes.array.isRequired,
        transformations: React.PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentTransformation: 0,
            pageNr: -1
        };
    }

    selectPage(pageNr) {
        this.setState({
            pageNr: pageNr
        });

    }

    nextTransformation() {
        this.setState({
            currentTransformation: this.state.currentTransformation + 1
        });
    }

    prevTransformation() {
        this.setState({
            currentTransformation: this.state.currentTransformation - 1
        });
    }


    render() {
        const {currentTransformation, pageNr} = this.state;
        const {pdfPages, transformations} = this.props;

        const header = "Parsed " + pdfPages.length + " pages!"

        var pageLinks = [];
        pageLinks.push(<a key={ -1 } onClick={ this.selectPage.bind(this, -1) } style={ { fontSize: '1.20em' } }>All</a>);
        pdfPages.forEach((pdfPage, i) => pageLinks.push(<a key={ i } onClick={ this.selectPage.bind(this, i) } style={ { fontSize: '1.10em' } }>
                                                          { " " + i }
                                                        </a>));

        const currentTransformationName = transformations[currentTransformation].name;
        const prevLink = <a onClick={ this.prevTransformation.bind(this) } className={ currentTransformation > 0 ? '' : 'disabled' }>
                           { '<==' }
                         </a>;
        const nextLink = <a onClick={ this.nextTransformation.bind(this) } className={ currentTransformation < transformations.length - 1 ? '' : 'disabled' }>
                           { '==>' }
                         </a>;

        const transformedPdfPages = pdfPages.filter((elem, i) => pageNr == -1 || i == pageNr).map(pdfPage => {
            for (var i = 0; i <= currentTransformation; i++) {
                pdfPage = transformations[i].transform(pdfPage);
            }
            return pdfPage;
        });

        var pageComponents = transformedPdfPages.map(page => <PdfPageView key={ page.index } pdfPage={ page } />);

        return (
            <div>
              <div>
                <Badge>
                  { pdfPages.length }
                </Badge> pages!
              </div>
              <div style={ { textAlign: 'center' } }>
                <div>
                  <b>Pages:</b>
                </div>
                <div>
                  { pageLinks }
                </div>
                <div>
                  <b>Current Transformation:</b>
                </div>
                <div>
                  { prevLink }
                  { " " + currentTransformationName + " " }
                  { nextLink }
                </div>
              </div>
              <hr/>
              { pageComponents }
            </div>
            );
    }
}
import React from 'react';

import Badge from 'react-bootstrap/lib/Badge'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Button from 'react-bootstrap/lib/Button'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'

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

    selectTransformation(currentTransformation) {
        this.setState({
            currentTransformation: currentTransformation
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

        const currentTransformationName = transformations[currentTransformation].name;

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
                <table style={ { width: '100%' } }>
                  <caption>
                    Pages
                  </caption>
                  <tbody>
                    <tr>
                      <td>
                        <ButtonToolbar>
                          <ButtonGroup>
                            <Button onClick={ this.selectPage.bind(this, -1) } className={ pageNr == -1 ? 'active' : '' }>
                              All
                            </Button>
                            { pdfPages.map((pdfPage, i) => <Button key={ i } onClick={ this.selectPage.bind(this, i) } className={ pageNr == i ? 'active' : '' }>
                                                             { i + 1 }
                                                           </Button>) }
                          </ButtonGroup>
                        </ButtonToolbar>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br/>
                <table>
                  <caption>
                    Current Transformation
                  </caption>
                  <tbody>
                    <tr>
                      <td>
                        <DropdownButton title={ currentTransformationName } id="dropdown-size-medium">
                          { transformations.map((transformation, i) => <MenuItem key={ i } eventKey={ i } onSelect={ this.selectTransformation.bind(this, i) }>
                                                                       { transformation.name }
                                                                       </MenuItem>) }
                        </DropdownButton>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <br/>
                        <Button className={ currentTransformation > 0 ? 'btn-round' : 'btn-round disabled' } onClick={ this.prevTransformation.bind(this) }>
                          ← Previous
                        </Button>
                        { ' ' }
                        <Button className={ currentTransformation < transformations.length - 1 ? 'btn-round' : 'btn-round disabled' } onClick={ this.nextTransformation.bind(this) }>
                          Next →
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <hr/>
              { pageComponents }
            </div>
            );
    }
}
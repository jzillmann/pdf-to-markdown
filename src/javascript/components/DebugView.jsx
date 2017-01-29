import React from 'react';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Button from 'react-bootstrap/lib/Button'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'

import ContentView from '../models/ContentView.jsx';
import PdfPageView from './PdfPageView.jsx';
import TextPageView from './TextPageView.jsx';

// A view which displays the content of the given pages transformed by the given transformations
export default class DebugView extends React.Component {

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

        const currentTransformationName = transformations[currentTransformation].name;

        var transformedPages = pdfPages;
        var contentView;
        var lastTransformation;
        for (var i = 0; i <= currentTransformation; i++) {
            if (lastTransformation) {
                transformedPages = lastTransformation.processAnnotations(transformedPages);
            }
            transformedPages = transformations[i].transform(transformedPages);
            contentView = transformations[i].contentView();
            lastTransformation = transformations[i];
        }

        transformedPages = transformedPages.filter((elem, i) => pageNr == -1 || i == pageNr);
        var pageComponents;
        switch (contentView) {
        case ContentView.PDF:
            pageComponents = transformedPages.map(page => <PdfPageView key={ page.index } pdfPage={ page } />);
            break;
        case ContentView.TEXT:
            //transformedPages.forEach(p => console.debug(p));
            pageComponents = transformedPages.map(page => <TextPageView key={ page.index } page={ page } />);
            break;
        }

        return (
            <div>
              <div>
                { lastTransformation.showPageSelection() &&
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
                  </table> }
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
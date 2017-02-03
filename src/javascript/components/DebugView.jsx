import React from 'react';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import Button from 'react-bootstrap/lib/Button'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import Pagination from 'react-bootstrap/lib/Pagination'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Label from 'react-bootstrap/lib/Label'

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
            pageNr: pageNr - 1
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
              <table>
                <tbody>
                  { lastTransformation.showPageSelection() &&
                    <tr>
                      <td>
                        <div>
                          <ul className='pagination'>
                            <li className={ pageNr == -1 ? 'active' : '' }>
                              <a role='button' onClick={ this.selectPage.bind(this, 0) }>ALL</a>
                            </li>
                          </ul>
                          <Pagination
                                      prev
                                      next
                                      first
                                      last
                                      ellipsis
                                      boundaryLinks
                                      items={ pdfPages.length }
                                      maxButtons={ 18 }
                                      activePage={ this.state.pageNr + 1 }
                                      onSelect={ this.selectPage.bind(this) } />
                        </div>
                      </td>
                      <td style={ { padding: '5px', textAlign: 'left' } }>
                        <Label bsStyle="info">
                          Pages
                        </Label>
                      </td>
                    </tr> }
                  <tr>
                    <td>
                      <ButtonToolbar>
                        <Button className={ currentTransformation > 0 ? 'btn-round' : 'btn-round disabled' } onClick={ this.prevTransformation.bind(this) }>
                          ← Previous
                        </Button>
                        { ' ' }
                        <Button className={ currentTransformation < transformations.length - 1 ? 'btn-round' : 'btn-round disabled' } onClick={ this.nextTransformation.bind(this) }>
                          Next →
                        </Button>
                        <DropdownButton title={ currentTransformationName } id="dropdown-size-medium">
                          { transformations.map((transformation, i) => <MenuItem key={ i } eventKey={ i } onSelect={ this.selectTransformation.bind(this, i) }>
                                                                       { transformation.name }
                                                                       </MenuItem>) }
                        </DropdownButton>
                      </ButtonToolbar>
                    </td>
                    <td style={ { padding: '5px' } }>
                      <Label bsStyle="info">
                        Transformations
                        { ' - ' + currentTransformation + ' / ' + (transformations.length - 1) }
                      </Label>
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr/>
              { pageComponents }
            </div>
            );
    }
}
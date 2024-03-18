import React from 'react';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Button from 'react-bootstrap/lib/Button'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import Pagination from 'react-bootstrap/lib/Pagination'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Label from 'react-bootstrap/lib/Label'
import Checkbox from 'react-bootstrap/lib/Checkbox'
import Collapse from 'react-bootstrap/lib/Collapse'
import Panel from 'react-bootstrap/lib/Panel'
import AutoAffix from 'react-overlays/lib/AutoAffix';

import ParseResult from '../models/ParseResult.jsx';

// A view which displays the content of the given pages transformed by the given transformations
export default class DebugView extends React.Component {

    static propTypes = {
        pages: React.PropTypes.array.isRequired,
        transformations: React.PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentTransformation: 0,
            pageNr: -1,
            modificationsOnly: false,
            showStatistics: false
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

    showModifications() {
        this.setState({
            modificationsOnly: !this.state.modificationsOnly
        });
    }

    showStatistics() {
        this.setState({
            showStatistics: !this.state.showStatistics
        });

    }


    render() {
        const {currentTransformation, pageNr} = this.state;
        const {pages, transformations} = this.props;

        const currentTransformationName = transformations[currentTransformation].name;

        var parseResult = new ParseResult({
            pages: pages
        });
        var lastTransformation;
        for (var i = 0; i <= currentTransformation; i++) {
            if (lastTransformation) {
                parseResult = lastTransformation.completeTransform(parseResult);
            }
            parseResult = transformations[i].transform(parseResult);
            lastTransformation = transformations[i];
        }

        parseResult.pages = parseResult.pages.filter((elem, i) => pageNr == -1 || i == pageNr);
        const pageComponents = parseResult.pages.map(page => lastTransformation.createPageView(page, this.state.modificationsOnly));
        const showModificationCheckbox = lastTransformation.showModificationCheckbox();
        const statisticsAsList = Object.keys(parseResult.globals).map((key, i) => {
            return <li key={ i }>
                     { key + ': ' + JSON.stringify(parseResult.globals[key]) }
                   </li>
        });
        const messagesAsList = parseResult.messages.map((message, i) => {
            return <li key={ i }>
                     { message }
                   </li>
        });

        const transformationMenuItems = [];
        var lastItemType;
        transformations.forEach((transformation, i) => {
            if (lastItemType && transformation.itemType !== lastItemType) {
                transformationMenuItems.push(<MenuItem key={ i + '-divider' } divider />);
            }
            transformationMenuItems.push(<MenuItem key={ i } eventKey={ i } onSelect={ this.selectTransformation.bind(this, i) }>
                                         { transformation.name }
                                         </MenuItem>);
            lastItemType = transformation.itemType;
        });

        return (
            <div>
              <AutoAffix viewportOffsetTop={ 0 } offsetTop={ 0 } container={ this }>
                <table>
                  <tbody>
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
                                      items={ pages.length }
                                      maxButtons={ 17 }
                                      activePage={ this.state.pageNr + 1 }
                                      onSelect={ this.selectPage.bind(this) } />
                        </div>
                      </td>
                      <td style={ { padding: '5px', textAlign: 'left' } }>
                        <Label bsStyle="info">
                          Pages
                        </Label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <ButtonToolbar>
                          <ButtonGroup>
                            <Button className={ currentTransformation > 0 ? 'btn-round' : 'btn-round disabled' } onClick={ this.prevTransformation.bind(this) }>
                              ← Previous
                            </Button>
                          </ButtonGroup>
                          <ButtonGroup>
                            { ' ' }
                            <Button className={ currentTransformation < transformations.length - 1 ? 'btn-round' : 'btn-round disabled' } onClick={ this.nextTransformation.bind(this) }>
                              Next →
                            </Button>
                          </ButtonGroup>
                          <ButtonGroup>
                            <DropdownButton title={ currentTransformationName } id="dropdown-size-medium">
                              { transformationMenuItems }
                            </DropdownButton>
                          </ButtonGroup>
                          <ButtonGroup>
                            { showModificationCheckbox &&
                              <Checkbox onClick={ this.showModifications.bind(this) }>
                                Show only modifications
                              </Checkbox> }
                          </ButtonGroup>
                          <ButtonGroup>
                            <Checkbox onClick={() => this.showStatistics()}>
                              Show Statistics
                            </Checkbox>
                          </ButtonGroup>
                        </ButtonToolbar>
                      </td>
                      <td style={ { padding: '5px' } }>
                        <Label bsStyle="info">
                          Transformations
                          { ' - ' + currentTransformation + ' / ' + (transformations.length - 1) }
                        </Label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Collapse in={ this.state.showStatistics }>
                          <Panel bsStyle="default">
                            <ul>
                              { statisticsAsList }
                            </ul>
                          </Panel>
                        </Collapse>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </AutoAffix>
              { !this.state.showStatistics &&
                <hr style={ { marginTop: '5px' } } /> }
              <ul>
                { messagesAsList }
              </ul>
              { pageComponents }
            </div>
        );
    }
}
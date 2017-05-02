import React from 'react';

import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import Popover from 'react-bootstrap/lib/Popover'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'

import AppLogo from './AppLogo.jsx';
import { View } from '../models/AppState.jsx';

export default class TopBar extends React.Component {

    static propTypes = {
        mainView: React.PropTypes.object.isRequired,
        switchMainViewFunction: React.PropTypes.func.isRequired,
        title: React.PropTypes.string.isRequired,
    };

    render() {
        const {mainView, switchMainViewFunction, title} = this.props;
        const aboutPopover = (
        <Popover id="popover-trigger-click-root-close" title={ `About PDF to Markdown Converter - ${ process.env.version }` }>
          <p>
            <i>PDF to Markdown Converter</i> will convert your uploaded PDF to Markdown format.
          </p>
        </Popover>
        );

        const showTabs = mainView == View.RESULT || mainView == View.DEBUG;

        return (
            <Navbar inverse>
              <Navbar.Header>
                <Navbar.Brand>
                  <Dropdown id="logo-dropdown">
                    <AppLogo bsRole="toggle" />
                    <Dropdown.Menu>
                      <MenuItem divider />
                      <MenuItem href="https://github.com/jzillmann/pdf-to-markdown/issues" target="_blank"> Feedback & Bug Reports
                      </MenuItem>
                      <MenuItem href="http://github.com/jzillmann/pdf-to-markdown" target="_blank"> Code @Github
                      </MenuItem>
                      <MenuItem divider />
                      <OverlayTrigger
                                      trigger="click"
                                      rootClose
                                      placement="bottom"
                                      overlay={ aboutPopover }>
                        <MenuItem eventKey="3"> About
                        </MenuItem>
                      </OverlayTrigger>
                    </Dropdown.Menu>
                  </Dropdown>
                </Navbar.Brand>
                { showTabs &&
                  <Nav bsStyle="tabs" activeKey={ mainView } pullRight>
                    <NavItem eventKey={ View.DEBUG } activeKey={ mainView } onSelect={ switchMainViewFunction }>
                      Debug View
                    </NavItem>
                    <NavItem eventKey={ View.RESULT } activeKey={ mainView } onSelect={ switchMainViewFunction }>
                      Result View
                    </NavItem>
                  </Nav> }
              </Navbar.Header>
              <Navbar.Collapse>
                <Navbar.Text pullRight={ true }>
                  { title }
                </Navbar.Text>
              </Navbar.Collapse>
            </Navbar>
        );
    }

}
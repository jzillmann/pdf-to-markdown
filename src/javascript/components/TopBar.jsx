import React from 'react';

import Navbar from 'react-bootstrap/lib/Navbar'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import Popover from 'react-bootstrap/lib/Popover'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'

import AppLogo from './AppLogo.jsx';

export default class TopBar extends React.Component {

    render() {

        const aboutPopover = (
        <Popover id="popover-trigger-click-root-close" title={ `About PDF to Markdown Converter - ${ process.env.version }` }>
          <p>
            <i>PDF to Markdown Converter</i> will convert your uploaded PDF to Markdown format.
          </p>
        </Popover>
        );

        return (
            <Navbar inverse>
              <Navbar.Header>
                <Navbar.Brand>
                  <Dropdown id="logo-dropdown">
                    <AppLogo bsRole="toggle" />
                    <Dropdown.Menu>
                      <MenuItem divider />
                      <MenuItem href="http://github.com/jzillmann/pdf-to-markdown" target="_blank"> Github
                      </MenuItem>
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
              </Navbar.Header>
            </Navbar>
            );
    }

}
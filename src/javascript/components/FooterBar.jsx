import React from 'react';

import Navbar from 'react-bootstrap/lib/Navbar'


export default class TopBar extends React.Component {

    render() {
        return (
            <Navbar>
              <Navbar.Header>
                <Navbar.Text>
                  This is a offline tool, your data stays locally and is not send to any server!
                </Navbar.Text>
              </Navbar.Header>
              <Navbar.Collapse>
                <Navbar.Text pullRight>
                  <a href="https://github.com/jzillmann/pdf-to-markdown/issues" target="_blank">Feedback & Bug Reports</a>
                </Navbar.Text>
              </Navbar.Collapse>
            </Navbar>
        );
    }

}
import React from 'react';

import Grid from 'react-bootstrap/lib/Grid'

import TopBar from './TopBar.jsx';
import { View } from '../models/AppState.jsx';
import PdfUploadView from './PdfUploadView.jsx';
import LoadingView from './LoadingView.jsx';
import PdfView from './PdfView.jsx';

export default class App extends React.Component {

    static propTypes = {
        appState: React.PropTypes.object.isRequired,
    };

    render() {
        console.debug(this.props.appState);

        var mainView;
        switch (this.props.appState.mainView) {
        case View.UPLOAD:
            mainView = <PdfUploadView uploadPdfFunction={ this.props.appState.uploadPdf } />
            break;
        case View.LOADING:
            mainView = <LoadingView/>
            break;
        case View.PDF_VIEW:
            mainView = <PdfView pdfPages={ this.props.appState.pdfPages } transformations={ this.props.appState.transformations } />
            break;
        }

        return (
            <div>
              <TopBar/>
              <Grid>
                <div>
                  { mainView }
                </div>
              </Grid>
            </div>
            );
    }
}



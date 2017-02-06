import React from 'react';

import Grid from 'react-bootstrap/lib/Grid'

import TopBar from './TopBar.jsx';
import { View } from '../models/AppState.jsx';
import PdfUploadView from './PdfUploadView.jsx';
import LoadingView from './LoadingView.jsx';
import ResultView from './ResultView.jsx';
import DebugView from './DebugView.jsx';

export default class App extends React.Component {

    static propTypes = {
        appState: React.PropTypes.object.isRequired,
    };

    render() {
        // console.debug(this.props.appState);
        const appState = this.props.appState;

        var mainView;
        switch (this.props.appState.mainView) {
        case View.UPLOAD:
            mainView = <PdfUploadView uploadPdfFunction={ appState.storeFileBuffer } />
            break;
        case View.LOADING:
            mainView = <LoadingView fileBuffer={ appState.fileBuffer } storePdfPagesFunction={ appState.storePdfPages } />
            break;
        case View.RESULT:
            mainView = <ResultView pdfPages={ appState.pdfPages } transformations={ appState.transformations } />
            break;
        case View.DEBUG:
            mainView = <DebugView pdfPages={ appState.pdfPages } transformations={ appState.transformations } />
            break;
        default:
            throw `View ${this.props.appState.mainView} not supported!`;
        }

        return (
            <div>
              <TopBar mainView={ appState.mainView } switchMainViewFunction={ appState.switchMainView } />
              <Grid>
                <div>
                  { mainView }
                </div>
              </Grid>
            </div>
            );
    }
}



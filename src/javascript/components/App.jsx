import React from 'react';

import Grid from 'react-bootstrap/lib/Grid'

import TopBar from './TopBar.jsx';
import FooterBar from './FooterBar.jsx'
import { View } from '../models/AppState.jsx';
import UploadView from './UploadView.jsx';
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
            mainView = <UploadView uploadPdfFunction={ appState.storeFileBuffer } />
            break;
        case View.LOADING:
            mainView = <LoadingView fileBuffer={ appState.fileBuffer } storePdfPagesFunction={ appState.storePdfPages } />
            break;
        case View.RESULT:
            mainView = <ResultView pages={ appState.pages } transformations={ appState.transformations } />
            break;
        case View.DEBUG:
            mainView = <DebugView pages={ appState.pages } transformations={ appState.transformations } />
            break;
        default:
            throw `View ${this.props.appState.mainView} not supported!`;
        }

        const title = appState.metadata && appState.metadata.title ? appState.metadata.title : '';
        return (
            <div>
              <TopBar mainView={ appState.mainView } switchMainViewFunction={ appState.switchMainView } title={ title } />
              <Grid>
                <div>
                  { mainView }
                </div>
              </Grid>
              <FooterBar/>
            </div>
        );
    }
}



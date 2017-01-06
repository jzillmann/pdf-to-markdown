import React from 'react';

import Spinner from './lib/Spinner.jsx';

export default class LoadingView extends React.Component {

    render() {
        return (
            <div style={ { textAlign: 'center' } }>
              <br/>
              <br/>
              <br/>
              <br/>
              <Spinner/>
              <br/>
              <br/>
              <div>
                Uploading and parsing PDF...
              </div>
            </div>);
    }
}
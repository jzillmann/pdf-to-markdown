import React from 'react';

import Alert from 'react-bootstrap/lib/Alert'
import Dropzone from 'react-dropzone'
import FaCloudUpload from 'react-icons/lib/fa/cloud-upload'

export default class UploadView extends React.Component {

    static propTypes = {
        uploadPdfFunction: React.PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            uploadPdfFunction: props.uploadPdfFunction,
        };
    }

    onDrop(files) {
        if (files.length > 1) {
            alert(`Maximum one file allowed to upload, but not ${files.length}!`)
            return
        }
        const reader = new FileReader();
        const uploadFunction = this.state.uploadPdfFunction;
        reader.onload = (evt) => {
            const fileBuffer = evt.target.result;
            uploadFunction(new Uint8Array(fileBuffer));
        };
        reader.readAsArrayBuffer(files[0]);
    }

    render() {
        return (
            <div>
              <Dropzone onDrop={ this.onDrop.bind(this) } multiple={ false } style={ { width: 400, height: 500, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed', borderRadius: 5, display: 'table-cell', textAlign: 'center', verticalAlign: 'middle' } }>
                <div className="container">
                  <h2>Drop your PDF file here!</h2>
                </div>
                <h1><FaCloudUpload width={ 100 } height={ 100 } /></h1>
                <br/>
                <Alert bsStyle="warning">
                  <i>This tool converts a PDF file into a Markdown text format! Simply drag & drop your PDF file on the upload area and go from there. Don't expect wonders, there are a lot of variances in generated PDF's from different tools and different ages. No matter how good the parser works for your PDF, you will have to invest a good amount of manuell work to complete it. Though this tool aims to be general purpose, it has been tested on a certain set of PDF's only.</i>
                </Alert>
              </Dropzone>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
            </div>
        );
    }

}
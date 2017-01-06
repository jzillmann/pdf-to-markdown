import React from 'react';

import Dropzone from 'react-dropzone'
import FaCloudUpload from 'react-icons/lib/fa/cloud-upload'

export default class PdfUploadView extends React.Component {

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
        console.debug(files.length);
        if (files.length > 1) {
            alert(`Maximum one file allowed to upload, but not ${files.length}!`)
            return
        }
        const reader = new FileReader();
        const uploadFunction = this.state.uploadPdfFunction;
        reader.onload = (evt) => {
            const fileBuffer = evt.target.result;
            uploadFunction(fileBuffer);
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
              </Dropzone>
            </div>
            );
    }

}
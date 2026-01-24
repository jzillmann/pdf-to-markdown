import React from 'react';
import Remarkable from 'remarkable';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Button from 'react-bootstrap/lib/Button'

import ParseResult from '../models/ParseResult.jsx';

export default class ResultView extends React.Component {

    static propTypes = {
        pages: React.PropTypes.array.isRequired,
        transformations: React.PropTypes.array.isRequired,
        pdfFileName: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.copyTimeoutId = null;
    }

    componentWillMount() {
        const {pages, transformations} = this.props;
        var parseResult = new ParseResult({
            pages: pages
        });
        var lastTransformation;
        transformations.forEach(transformation => {
            if (lastTransformation) {
                parseResult = lastTransformation.completeTransform(parseResult);
            }
            parseResult = transformation.transform(parseResult);
            lastTransformation = transformation;
        });

        var text = '';
        parseResult.pages.forEach(page => {
            page.items.forEach(item => {
                text += item + '\n';
            });
        });
        this.state = {
            preview: true,
            text: text,
            copied: false
        };
    }

    componentWillUnmount() {
        if (this.copyTimeoutId) {
            clearTimeout(this.copyTimeoutId);
        }
    }

    handleCopy() {
        if (this.copyTimeoutId) {
            clearTimeout(this.copyTimeoutId);
        }
        navigator.clipboard.writeText(this.state.text)
            .then(() => {
                this.setState({ copied: true });
                this.copyTimeoutId = setTimeout(() => {
                    this.setState({ copied: false });
                }, 2000);
            })
            .catch((err) => {
                console.error('Failed to copy text:', err);
            });
    }

    handleDownload() {
        const blob = new Blob([this.state.text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const baseName = this.props.pdfFileName
            ? this.props.pdfFileName.replace(/\.pdf$/i, '')
            : 'document';
        a.download = baseName + '.md';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    switchToPreview() {
        this.setState({
            preview: true
        });
    }

    switchToEdit() {
        this.setState({
            preview: false
        });
    }

    handleChange(event) {
        this.setState({
            text: event.target.value
        });
    }

    render() {
        const remarkable = new Remarkable({
            breaks: true,
            html: true
        });
        const {preview, text} = this.state;

        var textComponent;
        if (preview) {
            const html = remarkable.render(text);
            textComponent = <div dangerouslySetInnerHTML={ { __html: html } } />
        } else {
            textComponent = <textarea
                                      rows="45"
                                      cols="150"
                                      value={ text }
                                      onChange={ this.handleChange.bind(this) } />
        }
        return (
            <div>
              <ButtonToolbar>
                <ButtonGroup bsSize="medium">
                  <Button onClick={ this.switchToEdit.bind(this) } className={ !preview ? 'active' : '' }>
                    Edit
                  </Button>
                  <Button onClick={ this.switchToPreview.bind(this) } className={ preview ? 'active' : '' }>
                    Preview
                  </Button>
                </ButtonGroup>
                <ButtonGroup bsSize="medium">
                  <Button onClick={ this.handleCopy.bind(this) }>
                    { this.state.copied ? 'Copied!' : 'Copy' }
                  </Button>
                  <Button onClick={ this.handleDownload.bind(this) }>
                    Download
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
              <hr/>
              { textComponent }
            </div>
        );
    }

}
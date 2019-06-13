import React from 'react';
import FaCheck from 'react-icons/lib/fa/check'

import pdfjs from 'pdfjs-dist'; // eslint-disable-line no-unused-vars
pdfjs.GlobalWorkerOptions.workerSrc = 'bundle.worker.js';

import { Line } from 'rc-progress';

import Metadata from '../models/Metadata.jsx';
import { parse } from '../lib/pdf.jsx'


// Parses the PDF pages and displays progress
export default class LoadingView extends React.Component {

    static propTypes = {
        fileBuffer: React.PropTypes.object.isRequired,
        storePdfPagesFunction: React.PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        const progress = new Progress({
            stages: [
                new ProgressStage('Parsing Metadata', 2),
                new ProgressStage('Parsing Pages'),
                new ProgressStage('Parsing Fonts', 0)
            ]
        });
        Progress.prototype.metadataStage = () => {
            return progress.stages[0]
        };
        Progress.prototype.pageStage = () => {
            return progress.stages[1]
        };
        Progress.prototype.fontStage = () => {
            return progress.stages[2]
        };
        this.state = {
            document: null,
            metadata: null,
            pages: [],
            fontIds: new Set(),
            fontMap: new Map(),
            progress: progress,
        };
    }

    documentParsed(document, pages) {
        const metadataStage = this.state.progress.metadataStage();
        const pageStage = this.state.progress.pageStage();
        metadataStage.stepsDone++;

        const numPages = document.numPages;
        pageStage.steps = numPages;
        pageStage.stepsDone;

        this.setState({
            document: document,
            pages: pages,
        });
    }

    metadataParsed(metadata) {
        const metadataStage = this.state.progress.metadataStage();
        metadataStage.stepsDone++;
        // console.debug(new Metadata(metadata));
        this.setState({
            metadata: new Metadata(metadata),
        });
    }

    pageParsed(pages) {
        const pageStage = this.state.progress.pageStage();

        pageStage.stepsDone = pageStage.stepsDone + 1;
        this.setState({
            pages,
            progress: this.state.progress
        });
    }

    fontParsed(fonts) {
        const fontStage = this.state.progress.fontStage();
        fontStage.stepsDone++;
        this.setState({ //force rendering
            fontMap: fonts.map,
            fontIds: fonts.ids,
        });
        fontStage.steps = fonts.ids.size;
    }

    componentWillMount() {
        parse(
            {
                data: this.props.fileBuffer,
                cMapUrl: 'cmaps/',
                cMapPacked: true,
            },
            {
                documentParsed: this.documentParsed.bind(this),
                metadataParsed: this.metadataParsed.bind(this),
                pageParsed: this.pageParsed.bind(this),
                fontParsed: this.fontParsed.bind(this),
            }
        );
    }

    render() {
        const {pages, fontMap, metadata, progress} = this.state;
        const percentDone = getPercentDone(progress);
        if (percentDone == 100) {
            this.props.storePdfPagesFunction(metadata, fontMap, pages);
        }
        const stageItems = progress.stages.filter((elem, i) => i <= progress.currentStage).map((stage, i) => {
            const progressDetails = stage.steps ? stage.stepsDone + ' / ' + stage.steps : '';
            const checkmark = stage.isComplete() ? <FaCheck color={ 'green' } /> : '';
            return <div key={ i }>
                     { stage.name }
                     { ' ' + progressDetails + ' ' }
                     { checkmark }
                   </div>
        });
        return (
            <div style={ { textAlign: 'center' } }>
              <br/>
              <br/>
              <br/>
              <Line percent={ percentDone } strokeWidth="2" strokeColor="#D3D3D3" />
              <br/>
              <br/>
              <div>
                { stageItems }
              </div>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
            </div>);
    }
}

function getPercentDone(progress) {
    const activeStage = progress.activeStage();
    const percentDone = activeStage.percentDone();

    if (percentDone == 100) {
        progress.completeStage();
        if (!progress.isComplete()) {
            return getPercentDone(progress, 0);
        }
    }

    return percentDone;
}

class Progress {

    constructor(options) {
        this.stages = options.stages;
        this.currentStage = 0;
    }

    completeStage() {
        this.currentStage++;
    }

    isComplete() {
        return this.currentStage == this.stages.length;
    }

    activeStage() {
        return this.stages[this.currentStage];
    }

}

class ProgressStage {

    constructor(name, steps) {
        this.name = name;
        this.steps = steps ;
        this.stepsDone = 0;
    }

    isComplete() {
        return this.stepsDone == this.steps;
    }

    percentDone() {
        if (typeof this.steps === 'undefined') {
            // if (!this.steps) {
            return 0;
        }
        if (this.steps == 0) {
            return 100;
        }

        return this.stepsDone / this.steps * 100;
    }
}


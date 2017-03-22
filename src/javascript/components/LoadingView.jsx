import React from 'react';
import FaCheck from 'react-icons/lib/fa/check'

import pdfjs from 'pdfjs-dist'; // eslint-disable-line no-unused-vars
import { Line } from 'rc-progress';

import Metadata from '../models/Metadata.jsx';
import Page from '../models/Page.jsx';
import TextItem from '../models/TextItem.jsx';

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
                new ProgressStage('Parsing Fonts')
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

    documentParsed(document) {
        const metadataStage = this.state.progress.metadataStage();
        const pageStage = this.state.progress.pageStage();
        metadataStage.stepsDone++;

        const numPages = document.numPages;
        pageStage.steps = numPages;
        pageStage.stepsDone;

        var pages = [];
        for (var i = 0; i < numPages; i++) {
            pages.push(new Page({
                index: i
            }));
        }

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

    pageParsed(index, textItems) {
        const pageStage = this.state.progress.pageStage();
        const fontStage = this.state.progress.fontStage();
        const self = this;
        textItems.forEach(item => {
            const fontId = item.font;
            if (!this.state.fontIds.has(fontId)) {
                this.state.document.transport.commonObjs.get(fontId, function(font) {
                    self.fontParsed(fontId, font);
                });
                this.state.fontIds.add(fontId);
                fontStage.steps = this.state.fontIds.size;
            }
        });

        pageStage.stepsDone = pageStage.stepsDone + 1;
        this.state.pages[index].items = textItems; // eslint-disable-line react/no-direct-mutation-state
        this.setState({
            progress: this.state.progress
        });
    }

    fontParsed(fontId, font) {
        const fontStage = this.state.progress.fontStage();
        this.state.fontMap.set(fontId, font); // eslint-disable-line react/no-direct-mutation-state
        fontStage.stepsDone++;
        if (this.state.progress.activeStage() === fontStage) {
            this.setState({ //force rendering
                fontMap: this.state.fontMap,
            });
        }
    }

    componentWillMount() {
        const self = this;
        PDFJS.getDocument(this.props.fileBuffer).then(function(pdfDocument) { // eslint-disable-line no-undef
            // console.debug(pdfDocument);
            pdfDocument.getMetadata().then(function(metadata) {
                // console.debug(metadata);
                self.metadataParsed(metadata);
            });
            self.documentParsed(pdfDocument);
            for (var j = 1; j <= pdfDocument.numPages; j++) {
                pdfDocument.getPage(j).then(function(page) {
                    // console.debug(page);
                    var scale = 1.0;
                    var viewport = page.getViewport(scale);

                    page.getTextContent().then(function(textContent) {
                        // console.debug(textContent);
                        const textItems = textContent.items.map(function(item) {
                            const tx = PDFJS.Util.transform( // eslint-disable-line no-undef
                                viewport.transform,
                                item.transform
                            );

                            const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
                            const dividedHeight = item.height / fontHeight;
                            return new TextItem({
                                x: Math.round(item.transform[4]),
                                y: Math.round(item.transform[5]),
                                width: Math.round(item.width),
                                height: Math.round(dividedHeight <= 1 ? item.height : dividedHeight),
                                text: item.str,
                                font: item.fontName
                            });
                        });
                        self.pageParsed(page.pageIndex, textItems);
                    });
                    page.getOperatorList().then(function() {
                        // do nothing... this is only for triggering the font retrieval
                    });
                });
            }
        });
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
        if (!this.steps) {
            return 0;
        }
        return this.stepsDone / this.steps * 100;
    }
}


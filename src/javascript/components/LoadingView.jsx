import React from 'react';
import FaCheck from 'react-icons/lib/fa/check'

import pdfjs from 'pdfjs-dist'; // eslint-disable-line no-unused-vars
import { Line } from 'rc-progress';

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
        this.state = {
            pages: [],
            fontIds: new Set(),
            fontMap: new Map(),
            progress: new Progress({
                stages: [
                    new ProgressStage('Parsing PDF Pages'),
                    new ProgressStage('Parsing Fonts')
                ]
            }),
        };
    }

    announceInitialParse(document) {
        const pageStage = this.state.progress.stages[0];
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

    announcePageParsed(index, textItems) {
        const pageStage = this.state.progress.stages[0];
        const fontStage = this.state.progress.stages[1];
        textItems.forEach(item => {
            const fontId = item.font;
            if (!this.state.fontIds.has(fontId)) {
                const announceFontFunction = this.announceFontParsed.bind(this);
                this.state.document.transport.commonObjs.get(fontId, function(font) {
                    announceFontFunction(fontId, font);
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

    announceFontParsed(fontId, font) {
        const fontStage = this.state.progress.stages[1];
        this.state.fontMap.set(fontId, font); // eslint-disable-line react/no-direct-mutation-state
        fontStage.stepsDone = fontStage.stepsDone + 1;
        if (this.state.progress.currentStage == 1) {
            this.setState({ //force rendering
                fontMap: this.state.fontMap,
            });
        }
    }

    componentWillMount() {
        const announceInitialParseFunction = this.announceInitialParse.bind(this);
        const announcePageParsedFunction = this.announcePageParsed.bind(this);

        PDFJS.getDocument(this.props.fileBuffer).then(function(pdfDocument) { // eslint-disable-line no-undef
            // console.debug(pdfDocument);
            announceInitialParseFunction(pdfDocument);
            for (var j = 1; j <= pdfDocument.numPages; j++) {
                pdfDocument.getPage(j).then(function(page) {
                    var scale = 1.0;
                    var viewport = page.getViewport(scale);

                    // pdfDocument.getMetadata().then(function(data) {
                    //     console.debug(data);
                    // });
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
                        announcePageParsedFunction(page.pageIndex, textItems);
                    });
                    page.getOperatorList().then(function() {
                        // do nothing... this is only for triggering the font retrieval
                    });
                });
            }
        });
    }

    render() {
        const {pages, progress} = this.state;
        const percentDone = getPercentDone(progress);
        if (percentDone == 100) {
            this.props.storePdfPagesFunction(pages, this.state.fontMap);
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

    constructor(name) {
        this.name = name;
        this.stepsDone = 0;
        this.steps;
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


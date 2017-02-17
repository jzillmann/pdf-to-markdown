import React from 'react';

import pdfjs from 'pdfjs-dist'; // eslint-disable-line no-unused-vars
import { Line } from 'rc-progress';

import PdfPage from '../models/PdfPage.jsx';
import TextItem from '../models/TextItem.jsx';

export default class LoadingView extends React.Component {

    static propTypes = {
        fileBuffer: React.PropTypes.object.isRequired,
        storePdfPagesFunction: React.PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            parsedPages: 0,
            pdfPages: []
        };
    }

    anounceInitialParse(pdfPages) {
        this.setState({
            pdfPages: pdfPages
        });
    }

    anouncePageParsed(index, textItems) {
        //TODO might make problems.. concat unordered and order at the end ?
        this.state.pdfPages[index].textItems = textItems; // eslint-disable-line react/no-direct-mutation-state
        this.setState({
            parsedPages: this.state.parsedPages + 1
        });
    }


    componentWillMount() {
        const anounceInitialParseFunction = this.anounceInitialParse.bind(this);
        const anouncePageParsedFunction = this.anouncePageParsed.bind(this);
        PDFJS.getDocument(this.props.fileBuffer).then(function(pdfDocument) { // eslint-disable-line no-undef
            // console.log('Number of pages: ' + pdfDocument.numPages);
            // console.debug(pdfDocument);
            const numPages = pdfDocument.numPages;
            // const numPages = 4; // hack
            var pdfPages = [];
            for (var i = 0; i < numPages; i++) {
                pdfPages.push(new PdfPage({
                    index: i
                }));
            }
            anounceInitialParseFunction(pdfPages);
            for (var j = 1; j <= numPages; j++) {
                pdfDocument.getPage(j).then(function(page) {
                    var scale = 1.0;
                    var viewport = page.getViewport(scale);

                    // pdfDocument.getMetadata().then(function(data) {
                    //     console.debug(data);
                    // });
                    // page.getOperatorList().then(function(opList) {
                    //     console.debug(opList);
                    // // var svgGfx = new svgLib.SVGGraphics(page.commonObjs, page.objs);
                    // // return svgGfx.getSVG(opList, viewport).then(function (svg) {
                    // //   container.appendChild(svg);
                    // // });
                    // });
                    page.getTextContent().then(function(textContent) {
                        const textItems = textContent.items.map(function(item) {
                            const tx = PDFJS.Util.transform( // eslint-disable-line no-undef
                                viewport.transform,
                                item.transform
                            );

                            const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
                            const dividedHeight = item.height / fontHeight;

                            const style = textContent.styles[item.fontName];
                            return new TextItem({
                                x: Math.round(item.transform[4]),
                                y: Math.round(item.transform[5]),
                                width: Math.round(item.width),
                                height: Math.round(dividedHeight <= 1 ? item.height : dividedHeight),
                                text: item.str,
                                font: item.fontName,
                                fontAscent: style.ascent,
                                fontDescent: style.descent
                            });
                        });
                        anouncePageParsedFunction(page.pageIndex, textItems);
                    });
                });
            }
        });
    }

    render() {
        const {parsedPages, pdfPages} = this.state;
        var percentDone = 0;
        var details = '';
        if (pdfPages.length > 0) {
            percentDone = parsedPages / pdfPages.length * 100;
            details = parsedPages + ' / ' + pdfPages.length
            if (parsedPages == pdfPages.length) {
                this.props.storePdfPagesFunction(this.state.pdfPages);
            }
        }
        return (
            <div style={ { textAlign: 'center' } }>
              <br/>
              <br/>
              <br/>
              <Line percent={ percentDone } strokeWidth="2" strokeColor="#D3D3D3" />
              <br/>
              <br/>
              <div>
                Uploading and parsing PDF...
                <br/>
                { ' ' + details }
              </div>
            </div>);
    }
}
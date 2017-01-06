import pdfjs from 'pdfjs-dist';

import AppState from '../models/AppState.jsx';
import TextItem from '../models/TextItem.jsx';

export function pdfToTextItemsAsync(fileBuffer:ArrayBuffer, appState:AppState) {
    PDFJS.getDocument(fileBuffer).then(function(pdfDocument) {
        console.log('Number of pages: ' + pdfDocument.numPages);
        // console.debug(pdfDocument);
        const numPages = pdfDocument.numPages;
        // const numPages = 3;
        appState.setPageCount(numPages);
        for (var i = 0; i <= numPages; i++) {
            pdfDocument.getPage(i).then(function(page) {
                page.getTextContent().then(function(textContent) {
                    // console.debug(textContent);
                    const textItems = textContent.items.map(function(item) {
                        const transform = item.transform;
                        return new TextItem({
                            x: transform[4],
                            y: transform[5],
                            width: item.width,
                            height: item.height,
                            text: item.str
                        });
                    });
                    appState.setPdfPage(page.pageIndex, textItems);
                });
            });
        }
    });
}
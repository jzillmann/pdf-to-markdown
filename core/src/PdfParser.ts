import Item from './Item';
import Metadata from './Metadata';
import type ParseReporter from './ParseReporter';
import ParseResult from './ParseResult';

/**
 * Parses a PDF via PDFJS and returns a ParseResult which contains more or less the original data from PDFJS.
 */
export default class PdfParser {
  pdfjs: any;
  defaultParams: object;
  schema = ['str', 'fontName', 'dir', 'width', 'height', 'transform'];

  constructor(pdfjs: any, defaultParams = {}) {
    this.pdfjs = pdfjs;
    this.defaultParams = defaultParams;
  }

  async parse(src: string | Uint8Array | object, reporter: ParseReporter): Promise<ParseResult> {
    const documentInitParameters = { ...this.defaultParams, ...this.documentInitParameters(src) };
    return this.pdfjs
      .getDocument(documentInitParameters)
      .promise.then((pdfDocument) => {
        reporter.parsedDocumentHeader(pdfDocument.numPages);
        return Promise.all([
          pdfDocument.getMetadata().then((metadata) => {
            reporter.parsedMetadata();
            return metadata;
          }),
          this.extractPagesSequentially(pdfDocument, reporter),
        ]);
      })
      .then(([metadata, pages]) => {
        const pdfPages = pages.map((page) => page.page);
        const items = pages.reduce((allItems, page) => allItems.concat(page.items), []);
        const pageViewports = pdfPages.map((page) => {
          const viewPort = page.getViewport({ scale: 1.0 });
          return { transformFunction: (itemTransform: number[]) => this.pdfjs.Util.transform(viewPort, itemTransform) };
        });
        return new ParseResult(pdfPages, pageViewports, new Metadata(metadata), this.schema, items);
      });
  }

  private documentInitParameters(src: string | Uint8Array | object): object {
    if (typeof src === 'string') {
      return { url: src };
    }
    if (this.isArrayBuffer(src)) {
      return { data: src };
    }
    if (typeof src === 'object') {
      return src;
    }
    throw new Error('Invalid PDFjs parameter for getDocument. Need either Uint8Array, string or a parameter object');
  }

  private isArrayBuffer(object) {
    return typeof object === 'object' && object !== null && object.byteLength !== undefined;
  }

  private extractPagesSequentially(pdfDocument: any, reporter: ParseReporter): Promise<ParsedPage> {
    return [...Array(pdfDocument.numPages)].reduce((accumulatorPromise, _, index) => {
      return accumulatorPromise.then((accumulatedResults) => {
        return pdfDocument.getPage(index + 1).then((page) => {
          const viewport = page.getViewport({ scale: 1.0 });
          return this.triggerFontRetrieval(page).then(() =>
            page
              .getTextContent({
                normalizeWhitespace: false,
                disableCombineTextItems: true,
              })
              .then((textContent) => {
                const items = textContent.items.map((rawItem) => new Item(index, rawItem));
                reporter.parsedPage(index);
                return [...accumulatedResults, { index, page, items }];
              }),
          );
        });
      });
    }, Promise.resolve([]));
  }

  private triggerFontRetrieval(page): Promise<void> {
    return page.getOperatorList();
  }

  // async parseOld(data: Uint8Array): Promise<ParseResult> {
  //   return this.pdfjs
  //     .getDocument({
  //       data,
  //       cMapUrl: 'cmaps/',
  //       cMapPacked: true,
  //     })
  //     .promise.then((pdfDocument) => {
  //       // console.log('result', pdfDocument);
  //       const result = [...Array(pdfDocument.numPages)].reduce((accumulatorPromise, _, index) => {
  //         return accumulatorPromise.then((accumulatedResults) => {
  //           // console.log('Parsing page ' + index);
  //           return pdfDocument.getPage(index + 1).then((page) => {
  //             const viewport = page.getViewport({ scale: 1.0 });
  //             console.log(viewport);

  //             return this.triggerFontRetrieval(page).then(() =>
  //               page.getTextContent().then((textContent) => {
  //                 // console.log(textContent);
  //                 const textItems: TextItem[] = textContent.items.map((item) => {
  //                   const tx = this.pdfjs.Util.transform(viewport.transform, item.transform);
  //                   const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
  //                   const dividedHeight = item.height / fontHeight;

  //                   return {
  //                     x: Math.round(item.transform[4]),
  //                     y: Math.round(item.transform[5]),
  //                     width: Math.round(item.width),
  //                     height: Math.round(
  //                       Number.isNaN(dividedHeight) || dividedHeight <= 1 ? item.height : dividedHeight,
  //                     ),
  //                     text: item.str,
  //                     textDirection: TextDirection.fromPdfJs(item.dir),
  //                     fontId: item.fontName,
  //                   };
  //                 });

  //                 return [...accumulatedResults, ...textItems];
  //               }),
  //             );
  //           });
  //         });
  //       }, Promise.resolve([]));
  //       return Promise.all([pdfDocument.getMetadata(), result]);
  //     })
  //     .then(([metadata, r]) => {
  //       // console.log('Parsed metadata:', metadata);
  //       // console.log('Parsed result:', r.length);
  //       // console.log('Parsed result:', r);

  //       return {};
  //     });
  // }
}

interface ParsedPage {
  index: number;
  page: any;
  items: Item[];
}

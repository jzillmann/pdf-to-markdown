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
  schema = ['str', 'fontName', 'dir', 'transform', 'width', 'height'];

  constructor(pdfjs: any, defaultParams = {}) {
    this.pdfjs = pdfjs;
    this.defaultParams = defaultParams;
  }

  async parse(src: string | Uint8Array | object, reporter: ParseReporter): Promise<ParseResult> {
    const documentInitParameters = { ...this.defaultParams, ...this.documentInitParameters(src) };
    return this.pdfjs
      .getDocument(documentInitParameters)
      .promise.then((pdfDocument: any) => {
        reporter.parsedDocumentHeader(pdfDocument.numPages);
        return Promise.all([
          pdfDocument.getMetadata().then((metadata: any) => {
            reporter.parsedMetadata();
            return metadata;
          }),
          this.extractPagesSequentially(pdfDocument, reporter),
        ]);
      })
      .then(([metadata, pages]) => {
        const pdfPages = pages.map((page: any) => page.page);
        const items = pages.reduce((allItems: any[], page: any) => allItems.concat(page.items), []);
        const pageViewports = pdfPages.map((page: any) => {
          const viewPort = page.getViewport({ scale: 1.0 });
          return {
            transformFunction: (itemTransform: number[]) =>
              this.pdfjs.Util.transform(viewPort.transform, itemTransform),
          };
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

  private isArrayBuffer(object: any) {
    return typeof object === 'object' && object !== null && object.byteLength !== undefined;
  }

  private extractPagesSequentially(pdfDocument: any, reporter: ParseReporter): Promise<ParsedPage> {
    return [...Array(pdfDocument.numPages)].reduce((accumulatorPromise, _, index) => {
      return accumulatorPromise.then((accumulatedResults) => {
        return pdfDocument.getPage(index + 1).then((page: any) => {
          return this.triggerFontRetrieval(page).then(() =>
            page
              .getTextContent({
                normalizeWhitespace: false,
                disableCombineTextItems: true,
              })
              .then((textContent: any) => {
                const items = textContent.items.map((rawItem: any) => new Item(index, rawItem));
                reporter.parsedPage(index);
                return [...accumulatedResults, { index, page, items }];
              }),
          );
        });
      });
    }, Promise.resolve([]));
  }

  private triggerFontRetrieval(page: any): Promise<void> {
    return page.getOperatorList();
  }
}

interface ParsedPage {
  index: number;
  page: any;
  items: Item[];
}

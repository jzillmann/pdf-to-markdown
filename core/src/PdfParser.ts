import Item from './Item';
import Metadata from './Metadata';
import ParsedPage from './ParsedPage';
import type ParseReporter from './ParseReporter';
import ParseResult from './ParseResult';
import TextDirection from './TextDirection';
import type TextItem from './TextItem';

/**
 * Parses a PDF via PDFJS and returns a ParseResult which contains more or less the original data from PDFJS.
 */
export default class PdfParser {
  pdfjs: any;
  columns = ['str', 'dir', 'width', 'height', 'transfom', 'fontName'];
  constructor(pdfjs: any) {
    this.pdfjs = pdfjs;
  }

  async parseBytes(data: Uint8Array, reporter: ParseReporter): Promise<ParseResult> {
    return this.parse(this.params({ data }), reporter);
  }

  async parseUrl(url: string, reporter: ParseReporter): Promise<ParseResult> {
    return this.parse(this.params({ url }), reporter);
  }

  private params(dataSourceParams: object): object {
    const defaultParams = {
      cMapUrl: 'cmaps/',
      cMapPacked: true,
    };
    return { ...defaultParams, ...dataSourceParams };
  }

  async parse(parameter: object, reporter: ParseReporter): Promise<ParseResult> {
    return this.pdfjs
      .getDocument(parameter)
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
        const pdfPages = pages.map((page) => page.pdfPage);
        const items = pages.reduce((allItems, page) => allItems.concat(page.items), []);
        return new ParseResult(pdfPages, new Metadata(metadata), this.columns, items);
      });
  }

  private extractPagesSequentially(pdfDocument: any, reporter: ParseReporter): Promise<ParsedPage> {
    return [...Array(pdfDocument.numPages)].reduce((accumulatorPromise, _, index) => {
      return accumulatorPromise.then((accumulatedResults) => {
        return pdfDocument.getPage(index + 1).then((page) => {
          return this.triggerFontRetrieval(page).then(() =>
            page
              .getTextContent({
                normalizeWhitespace: false,
                disableCombineTextItems: true,
              })
              .then((textContent) => {
                const items = textContent.items.map((rawItem) => new Item(index, rawItem));
                reporter.parsedPage(index);
                return [...accumulatedResults, new ParsedPage(index, page, items)];
              }),
          );
        });
      });
    }, Promise.resolve([]));
  }

  private triggerFontRetrieval(page): Promise<void> {
    return page.getOperatorList();
  }

  async parseOld(data: Uint8Array): Promise<ParseResult> {
    return this.pdfjs
      .getDocument({
        data,
        cMapUrl: 'cmaps/',
        cMapPacked: true,
      })
      .promise.then((pdfDocument) => {
        // console.log('result', pdfDocument);
        const result = [...Array(pdfDocument.numPages)].reduce((accumulatorPromise, _, index) => {
          return accumulatorPromise.then((accumulatedResults) => {
            // console.log('Parsing page ' + index);
            return pdfDocument.getPage(index + 1).then((page) => {
              const viewport = page.getViewport({ scale: 1.0 });
              return this.triggerFontRetrieval(page).then(() =>
                page.getTextContent().then((textContent) => {
                  // console.log(textContent);
                  const textItems: TextItem[] = textContent.items.map((item) => {
                    const tx = this.pdfjs.Util.transform(viewport.transform, item.transform);
                    const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
                    const dividedHeight = item.height / fontHeight;

                    return {
                      x: Math.round(item.transform[4]),
                      y: Math.round(item.transform[5]),
                      width: Math.round(item.width),
                      height: Math.round(
                        Number.isNaN(dividedHeight) || dividedHeight <= 1 ? item.height : dividedHeight,
                      ),
                      text: item.str,
                      textDirection: TextDirection.fromPdfJs(item.dir),
                      fontId: item.fontName,
                    };
                  });

                  return [...accumulatedResults, ...textItems];
                }),
              );
            });
          });
        }, Promise.resolve([]));
        return Promise.all([pdfDocument.getMetadata(), result]);
      })
      .then(([metadata, r]) => {
        // console.log('Parsed metadata:', metadata);
        // console.log('Parsed result:', r.length);
        // console.log('Parsed result:', r);

        return new ParseResult([], new Metadata(metadata), [], []);
      });
  }
}

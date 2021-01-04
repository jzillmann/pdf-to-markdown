import Metadata from './Metadata';
import ParsedPage from './ParsedPage';
import ParseResult from './ParseResult';
import TextDirection from './TextDirection';
import type TextItem from './TextItem';

export default class PdfParser {
  pdfjs: any;
  constructor(pdfjs: any) {
    this.pdfjs = pdfjs;
  }

  async parse(data: Uint8Array): Promise<ParseResult> {
    return this.pdfjs
      .getDocument({
        data,
        cMapUrl: 'cmaps/',
        cMapPacked: true,
      })
      .promise.then((pdfDocument) => {
        return Promise.all([pdfDocument.getMetadata(), this.extractPagesSequentially(pdfDocument)]);
      })
      .then(([metadata, pages]) => new ParseResult(new Metadata(metadata), pages));
  }

  private extractPagesSequentially(pdfDocument: any): Promise<ParsedPage> {
    return [...Array(pdfDocument.numPages)].reduce((accumulatorPromise, _, index) => {
      return accumulatorPromise.then((accumulatedResults) => {
        return pdfDocument.getPage(index + 1).then((page) => {
          const viewport = page.getViewport({ scale: 1.0 });
          return this.triggerFontRetrieval(page).then(() =>
            page
              .getTextContent()
              .then((textContent) => [
                ...accumulatedResults,
                new ParsedPage(index, viewport.transform, textContent.items),
              ]),
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

        return new ParseResult(new Metadata(metadata), r);
      });
  }
}

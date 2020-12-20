import ParseResult from './ParseResult';
import PdfParser from './PdfParser';

export function pdfParser(pdfJs: any) {
  return new PdfParser(pdfJs);
}

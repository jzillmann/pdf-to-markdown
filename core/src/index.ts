import type ProgressListenFunction from './ProgressListenFunction';
import ParseProgressReporter from './ParseProgressReporter';
import PdfParser from './PdfParser';

export function pdfParser(pdfJs: any) {
  return new PdfParser(pdfJs);
}

export function parseReporter(progressListener: ProgressListenFunction) {
  return new ParseProgressReporter(progressListener);
}

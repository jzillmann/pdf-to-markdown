import Config from './Config';
import type ProgressListenFunction from './ProgressListenFunction';
import ParseProgressReporter from './ParseProgressReporter';
import PdfParser from './PdfParser';
import PdfPipeline from './PdfPipeline';

import AdjustHeight from './transformer/AdjustHeight';
import CalculateCoordinates from './transformer/CalculateCoordinates';

const transformers = [new AdjustHeight(), new CalculateCoordinates()];

const defaultConfig: Config = {
  pdfjsParams: {
    // TODO check if that cmap thing makes sense since we don't bundle them
    cMapUrl: 'cmaps/',
    cMapPacked: true,
  },
  transformers,
};

export function pdfParser(pdfJs: any) {
  return new PdfParser(pdfJs, defaultConfig.pdfjsParams);
}

export function parseReporter(progressListener: ProgressListenFunction) {
  return new ParseProgressReporter(progressListener);
}

export function createPipeline(pdfJs: any, config = defaultConfig): PdfPipeline {
  const parser = new PdfParser(pdfJs, config.pdfjsParams);
  return new PdfPipeline(parser, config.transformers || transformers);
}

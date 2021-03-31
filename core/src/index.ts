import Config from './Config';
import type ProgressListenFunction from './ProgressListenFunction';
import ParseProgressReporter from './ParseProgressReporter';
import PdfParser from './PdfParser';
import PdfPipeline from './PdfPipeline';

import AdjustHeight from './transformer/AdjustHeight';
import UnwrapCoordinates from './transformer/UnwrapCoordinates';
import RemoveEmptyItems from './transformer/RemoveEmptyItems';
import CalculateStatistics from './transformer/CacluclateStatistics';
import CompactLines from './transformer/CompactLines';
import SortXWithinLines from './transformer/SortXWithinLines';
import RemoveRepetitiveItems from './transformer/RemoveRepetitiveItems';
import NoOpTransformer from './transformer/NoOpTransformer';

export const transformers = [
  new AdjustHeight(),
  new UnwrapCoordinates(),
  new RemoveEmptyItems(),
  new CalculateStatistics(),
  new CompactLines(),
  new SortXWithinLines(),
  new RemoveRepetitiveItems(),
  new NoOpTransformer(),
];

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

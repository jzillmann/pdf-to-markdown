import TransformConfig from './Config';
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
import DetectToc from './transformer/DetectToc';
import DetectHeaders from './transformer/DetectHeaders';
import NoOpTransformer from './transformer/NoOpTransformer';
import {type ParseConfig } from './parse';

export const transformers = [
  new AdjustHeight(),
  new UnwrapCoordinates(),
  new RemoveEmptyItems(),
  new CalculateStatistics(),
  new CompactLines(),
  new SortXWithinLines(),
  new RemoveRepetitiveItems(),
  new DetectToc(),
  new DetectHeaders(),
  new NoOpTransformer(),
];

export interface Options {
  parseConfig?: ParseConfig;
  transformConfig?: TransformConfig;
}

export function parseReporter(progressListener: ProgressListenFunction) {
  return new ParseProgressReporter(progressListener);
}

export function createPipeline(pdfJs: any, options: Options = {}): PdfPipeline {
  const parser = new PdfParser(pdfJs);
  return new PdfPipeline(parser, options.transformConfig?.transformers || transformers);
}

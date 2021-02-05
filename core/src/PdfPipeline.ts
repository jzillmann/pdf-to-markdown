import PdfParser from './PdfParser';
import ProgressListenFunction from './ProgressListenFunction';
import ParseProgressReporter from './ParseProgressReporter';
import ItemTransformer from './transformer/ItemTransformer';
import Item from './Item';
import ParseResult from './ParseResult';
import Debugger from './Debugger';
import { verifyRequiredColumns } from './transformer/transformerUtil';
import TransformContext from './transformer/TransformContext';

export default class PdfPipeline {
  parser: PdfParser;
  transformers: ItemTransformer[];

  constructor(parser: PdfParser, transformers: ItemTransformer[]) {
    this.parser = parser;
    this.transformers = transformers;
  }

  private async parse(
    src: string | Uint8Array | object,
    progressListener: ProgressListenFunction,
  ): Promise<ParseResult> {
    const parseResult = await this.parser.parse(src, new ParseProgressReporter(progressListener));
    verifyRequiredColumns(parseResult.schema, this.transformers);
    return parseResult;
  }
  //TODO PipelineResult
  async execute(src: string | Uint8Array | object, progressListener: ProgressListenFunction): Promise<ParseResult> {
    const parseResult = await this.parse(src, progressListener);
    const context = { pageViewports: parseResult.pageViewports };
    let items = parseResult.items;
    this.transformers.forEach((transformer) => {
      items = transformer.transform(context, items);
    });
    parseResult.items = items;
    return parseResult;
  }

  async debug(src: string | Uint8Array | object, progressListener: ProgressListenFunction): Promise<Debugger> {
    const parseResult = await this.parse(src, progressListener);
    const context = { pageViewports: parseResult.pageViewports };
    return new Debugger(parseResult.schema, parseResult.items, context, this.transformers);
  }
}

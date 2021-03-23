import PdfParser from './PdfParser';
import ProgressListenFunction from './ProgressListenFunction';
import ParseProgressReporter from './ParseProgressReporter';
import ItemTransformer from './transformer/ItemTransformer';
import ParseResult from './ParseResult';
import Debugger from './Debugger';
import { assert } from './assert';
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
    this.verifyRequiredColumns(parseResult.schema, this.transformers);
    return parseResult;
  }
  //TODO PipelineResult
  async execute(src: string | Uint8Array | object, progressListener: ProgressListenFunction): Promise<ParseResult> {
    const parseResult = await this.parse(src, progressListener);
    this.verifyRequiredColumns(parseResult.schema, this.transformers);
    let items = parseResult.items;
    this.transformers.forEach((transformer) => {
      const context = new TransformContext(parseResult.fontMap, parseResult.pageViewports);
      items = transformer.transform(context, items).items;
    });
    parseResult.items = items;
    return parseResult;
  }

  async debug(src: string | Uint8Array | object, progressListener: ProgressListenFunction): Promise<Debugger> {
    const parseResult = await this.parse(src, progressListener);
    return new Debugger(
      parseResult.fontMap,
      parseResult.pageViewports,
      parseResult.pageCount,
      parseResult.schema,
      parseResult.items,
      this.transformers,
    );
  }

  /**
   * Goes through all transformer and makes sure each required column is available in its predecessor schema.
   *
   * @param inputSchema
   * @param transformers
   */
  verifyRequiredColumns(inputSchema: string[], transformers: ItemTransformer[]) {
    const schemas: string[][] = [inputSchema];
    for (let idx = 0; idx < transformers.length; idx++) {
      const transformer = transformers[idx];
      const predecessorSchema = schemas[idx];
      transformer.descriptor.requireColumns?.forEach((column) => {
        assert(
          predecessorSchema.includes(column),
          `Input schema [${predecessorSchema.join(', ')}] for transformer '${
            transformer.name
          }' does not contain the required column '${column}'`,
        );
      });
      const outputSchema = transformer.schemaTransformer(predecessorSchema);
      schemas.push(outputSchema);
    }
  }
}

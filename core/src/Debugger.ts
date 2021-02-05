import { assert } from './assert';
import Item from './Item';
import ItemTransformer from './transformer/ItemTransformer';
import ParseResult from './ParseResult';
import { calculateSchemas } from './transformer/transformerUtil';
import TransformContext from './transformer/TransformContext';

export default class Debugger {
  // parseResult: ParseResult;
  context: TransformContext;
  transformers: ItemTransformer[];
  stageNames: string[];
  stageSchema: string[][];
  private stageItems: Item[][];

  constructor(
    initialSchema: string[],
    initialItems: Item[],
    context: TransformContext,
    transformers: ItemTransformer[],
  ) {
    // this.parseResult = parseResult;
    this.transformers = transformers;
    this.context = context;
    this.stageNames = ['Parse Result', ...transformers.map((t) => t.name)];
    this.stageItems = [initialItems];
    this.stageSchema = calculateSchemas(initialSchema, transformers);
  }

  //TODO return MarkedItem ? (removed, added, etc..)?
  //TODO StageResult == class with schema and marked items ?
  stageResults(stageIndex: number): Item[] {
    for (let idx = 0; idx < stageIndex + 1; idx++) {
      if (!this.stageItems[idx]) {
        const stageItems = this.transformers[idx - 1].transform(this.context, this.stageItems[idx - 1]);
        this.stageItems.push(stageItems);
      }
    }
    return this.stageItems[stageIndex];
  }
}

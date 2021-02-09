import { assert } from './assert';
import Item from './Item';
import ItemResult from './ItemResult';
import ItemTransformer from './transformer/ItemTransformer';
import { calculateSchemas } from './transformer/transformerUtil';
import TransformContext from './transformer/TransformContext';

export default class Debugger {
  // parseResult: ParseResult;
  context: TransformContext;
  transformers: ItemTransformer[];
  stageNames: string[];
  stageSchema: string[][];
  private stageResultCache: ItemResult[];

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
    this.stageResultCache = [{ items: initialItems, messages: [`Parsed ${initialItems[initialItems.length-1].page+1} pages with ${initialItems.length} items`] }];
    this.stageSchema = calculateSchemas(initialSchema, transformers);
  }

  //TODO return MarkedItem ? (removed, added, etc..)?
  //TODO StageResult == class with schema and marked items ?
  stageResults(stageIndex: number): ItemResult {
    for (let idx = 0; idx < stageIndex + 1; idx++) {
      if (!this.stageResultCache[idx]) {
        const stageResult = this.transformers[idx - 1].transform(this.context, [
          ...this.stageResultCache[idx - 1].items,
        ]);
        this.stageResultCache.push(stageResult);
      }
    }
    return this.stageResultCache[stageIndex];
  }
}

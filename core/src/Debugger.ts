import Item from './Item';
import ItemTransformer from './transformer/ItemTransformer';
import TransformContext from './transformer/TransformContext';
import StageResult from './debug/StageResult';
import ColumnAnnotation from './debug/ColumnAnnotation';
import AnnotatedColumn from './debug/AnnotatedColumn';
import { detectChanges } from './debug/detectChanges';

export default class Debugger {
  private context: TransformContext;
  private transformers: ItemTransformer[];
  private stageResultCache: StageResult[];
  stageNames: string[];

  constructor(inputSchema: string[], inputItems: Item[], context: TransformContext, transformers: ItemTransformer[]) {
    this.transformers = transformers;
    this.context = context;
    this.stageNames = ['Parse Result', ...transformers.map((t) => t.name)];
    this.stageResultCache = [
      {
        schema: inputSchema.map((column) => ({ name: column })),
        items: inputItems,
        changes: new Map(),
        messages: [
          `Parsed ${inputItems.length === 0 ? 0 : inputItems[inputItems.length - 1].page + 1} pages with ${
            inputItems.length
          } items`,
        ],
      },
    ];
  }

  //TODO return MarkedItem ? (removed, added, etc..)?
  stageResults(stageIndex: number): StageResult {
    for (let idx = 0; idx < stageIndex + 1; idx++) {
      if (!this.stageResultCache[idx]) {
        const transformer = this.transformers[idx - 1];
        const previousStageResult: StageResult = this.stageResultCache[idx - 1];
        const inputSchema = toSimpleSchema(previousStageResult);
        const outputSchema = transformer.schemaTransformer(inputSchema);
        const itemResult = transformer.transform(this.context, [...previousStageResult.items]);

        const changes = detectChanges(previousStageResult.items, itemResult.items);

        const stageResult = {
          descriptor: transformer.descriptor,
          schema: toAnnotatedSchema(inputSchema, outputSchema),
          ...itemResult,
          changes,
        };
        if (changes.size > 0) {
          stageResult.messages.unshift(`Detected ${changes.size} changes`);
        }
        this.stageResultCache.push(stageResult);
      }
    }
    return this.stageResultCache[stageIndex];
  }
}

function toSimpleSchema(stageResult: StageResult): string[] {
  return stageResult.schema
    .filter((column) => !column.annotation || column.annotation !== ColumnAnnotation.REMOVED)
    .map((column) => column.name);
}

function toAnnotatedSchema(inputSchema: string[], outputSchema: string[]): AnnotatedColumn[] {
  const annotatedSchema: AnnotatedColumn[] = [];
  let out_idx = 0;
  for (let in_idx = 0; in_idx < inputSchema.length; in_idx++) {
    const nextInputColumn = inputSchema[in_idx];
    const indexInOut = outputSchema.indexOf(nextInputColumn);
    if (indexInOut === -1) {
      annotatedSchema.push({ name: nextInputColumn, annotation: ColumnAnnotation.REMOVED });
    } else if (indexInOut > out_idx) {
      while (out_idx < indexInOut) {
        annotatedSchema.push({ name: outputSchema[out_idx], annotation: ColumnAnnotation.ADDED });
        out_idx++;
      }
      annotatedSchema.push({ name: nextInputColumn });
      out_idx++;
    } else {
      annotatedSchema.push({ name: nextInputColumn });
      out_idx++;
    }
  }
  for (let index = out_idx; index < outputSchema.length; index++) {
    annotatedSchema.push({ name: outputSchema[index], annotation: ColumnAnnotation.ADDED });
  }
  return annotatedSchema;
}

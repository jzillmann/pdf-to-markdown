import type TransformerDescriptor from '../TransformerDescription';
import type TransformContext from './TransformContext';
import type Item from '../Item';
import type ItemResult from '../ItemResult';

/**
 * Transforms the incoming schema to what the transformer produces.
 */
type SchemaTransformer = (incomingSchema: string[]) => string[];

export default abstract class ItemTransformer {
  readonly name: string;
  readonly description: string;
  readonly descriptor: TransformerDescriptor;
  readonly schemaTransformer: SchemaTransformer;

  constructor(
    name: string,
    description: string,
    descriptor: TransformerDescriptor,
    schemaTransformer: SchemaTransformer = (schema) => schema,
  ) {
    this.name = name;
    this.description = description;
    this.descriptor = {
      ...{
        consumesGlobels: [],
        producesGlobels: [],
        requireColumns: [],
      },
      ...descriptor,
    };
    this.schemaTransformer = schemaTransformer;
  }

  abstract transform(context: TransformContext, items: Item[]): ItemResult;
}

import TransformerDescriptor from 'src/TransformerDescription';
import { assert } from '../assert';
import ItemTransformer from './ItemTransformer';

/**
 * Goes through all transformer and makes sure each required column ({@link TransformerDescription#consumes}) is available in its predecessor schema.
 *
 * @param initialSchema
 * @param transformers
 */
export function verifyRequiredColumns(initialSchema: string[], transformers: ItemTransformer[]) {
  calculateSchemas(initialSchema, transformers);
}

//TODO debug schema
// initial - all unanotated
// second - 2 removed, 1 added
// third - all as before without the removed

export function calculateSchemas(initialSchema: string[], transformers: ItemTransformer[]): string[][] {
  const schemas: string[][] = [];
  schemas.push(initialSchema);
  for (let idx = 0; idx < transformers.length; idx++) {
    const transformer = transformers[idx];
    const inputSchema = schemas[idx];
    validateReferences(inputSchema, transformer.name, transformer.descriptor);
    const outputSchema = transformer.schemaTransformer(inputSchema);
    schemas.push(outputSchema);
  }
  return schemas;
}

function validateReferences(
  inputSchema: string[],
  transformerName: string,
  transformerDescriptor: TransformerDescriptor,
) {
  transformerDescriptor.requireColumns?.forEach((column) => {
    assert(
      inputSchema.includes(column),
      `Input schema [${inputSchema.join(
        ', ',
      )}] for transformer '${transformerName}' does not contain the required column '${column}' (consumes)`,
    );
  });
}

import TransformerDescription from 'src/TransformerDescription';
import Item from 'src/Item';
import ItemTransformer from 'src/transformer/ItemTransformer';
import TransformContext from 'src/transformer/TransformContext';
import { calculateSchemas, verifyRequiredColumns } from 'src/transformer/transformerUtil';

class TestSchemaTransformer extends ItemTransformer {
  constructor(name: string, description: TransformerDescription) {
    super(name, description);
  }
  transform(_: TransformContext, items: Item[]): Item[] {
    return items;
  }
}

test('verify valid transform', async () => {
  const inputSchema = ['A', 'B', 'C'];

  const transformers = [
    new TestSchemaTransformer('Replace B & C with D', { consumes: ['B', 'C'], produces: ['D'], removes: ['B', 'C'] }),
    new TestSchemaTransformer('Create E', { produces: ['E'] }),
    new TestSchemaTransformer('Uses A, D & E', { consumes: ['A', 'D', 'E'] }),
  ];
  verifyRequiredColumns(inputSchema, transformers);
});

test('verify invalid consume', async () => {
  const inputSchema = ['A', 'B', 'C'];

  const transformers = [new TestSchemaTransformer('Consumes X', { consumes: ['X'] })];
  expect(() => verifyRequiredColumns(inputSchema, transformers)).toThrowError(
    "Input schema [A, B, C] for transformer 'Consumes X' does not contain the required column 'X' (consumes)",
  );
});

test('verify invalid remove', async () => {
  const inputSchema = ['A', 'B', 'C'];

  const transformers = [new TestSchemaTransformer('Removes X', { removes: ['X'] })];
  expect(() => verifyRequiredColumns(inputSchema, transformers)).toThrowError(
    "Input schema [A, B, C] for transformer 'Removes X' does not contain the required column 'X' (removes)",
  );
});

test('calculate schemas', async () => {
  const inputSchema = ['A', 'B', 'C'];

  const transformers = [
    new TestSchemaTransformer('Replace B & C with D', { consumes: ['B', 'C'], produces: ['D'], removes: ['B', 'C'] }),
    new TestSchemaTransformer('Create E', { produces: ['E'] }),
    new TestSchemaTransformer('Uses A, D & E', { consumes: ['A', 'D', 'E'] }),
  ];
  expect(calculateSchemas(inputSchema, transformers)).toEqual([
    ['A', 'B', 'C'],
    ['A', 'D'],
    ['A', 'D', 'E'],
    ['A', 'D', 'E'],
  ]);
});

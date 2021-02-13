import TransformerDescriptor from 'src/TransformerDescription';
import Item from 'src/Item';
import ItemResult from 'src/ItemResult';
import ItemTransformer from 'src/transformer/ItemTransformer';
import TransformContext from 'src/transformer/TransformContext';
import { calculateSchemas, verifyRequiredColumns } from 'src/transformer/transformerUtil';

class TestSchemaTransformer extends ItemTransformer {
  constructor(name: string, descriptor: TransformerDescriptor, outputSchema: string[] | undefined = undefined) {
    if (outputSchema) {
      super(name, `Description for ${name}`, descriptor, (_) => outputSchema);
    } else {
      super(name, `Description for ${name}`, descriptor);
    }
  }
  transform(_: TransformContext, items: Item[]): ItemResult {
    return { items, messages: [] };
  }
}

test('verify valid transform', async () => {
  const inputSchema = ['A', 'B', 'C'];

  const transformers = [
    new TestSchemaTransformer('Replace B & C with D', { requireColumns: ['B', 'C'] }, ['A', 'D']),
    new TestSchemaTransformer('Create E', {}, ['A', 'D', 'E']),
    new TestSchemaTransformer('Uses A, D & E', { requireColumns: ['A', 'D', 'E'] }, ['A', 'D', 'E']),
  ];
  verifyRequiredColumns(inputSchema, transformers);
});

test('verify invalid consume', async () => {
  const inputSchema = ['A', 'B', 'C'];

  const transformers = [new TestSchemaTransformer('Consumes X', { requireColumns: ['X'] })];
  expect(() => verifyRequiredColumns(inputSchema, transformers)).toThrowError(
    "Input schema [A, B, C] for transformer 'Consumes X' does not contain the required column 'X' (consumes)",
  );
});

test('calculate schemas', async () => {
  const inputSchema = ['A', 'B', 'C'];

  const transformers = [
    new TestSchemaTransformer(
      'Replace B & C with D',
      {
        requireColumns: ['B', 'C'],
      },
      ['A', 'D'],
    ),
    new TestSchemaTransformer('Create E', {}, ['A', 'D', 'E']),
    new TestSchemaTransformer('Uses A, D & E', { requireColumns: ['A', 'D', 'E'] }),
  ];
  expect(calculateSchemas(inputSchema, transformers)).toEqual([
    ['A', 'B', 'C'],
    ['A', 'D'],
    ['A', 'D', 'E'],
    ['A', 'D', 'E'],
  ]);
});

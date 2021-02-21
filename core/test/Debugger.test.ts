import Debugger from 'src/Debugger';
import Item from 'src/Item';
import ItemTransformer from 'src/transformer/ItemTransformer';
import TransformDescriptor from 'src/TransformDescriptor';
import TransformContext from 'src/transformer/TransformContext';
import ItemResult from 'src/ItemResult';
import ColumnAnnotation from 'src/debug/ColumnAnnotation';
import AnnotatedColumn from 'src/debug/AnnotatedColumn';

class TestTransformer extends ItemTransformer {
  items: Item[];
  constructor(name: string, descriptor: Partial<TransformDescriptor>, outputSchema: string[], items: Item[]) {
    super(name, `Description for ${name}`, descriptor, (incomingSchema) => outputSchema);
    this.items = items;
  }
  transform(_: TransformContext, items: Item[]): ItemResult {
    return {
      items: this.items,
      messages: [],
    };
  }
}

test('basic debug', async () => {
  const parsedSchema = ['A', 'B'];
  const parsedItems = [new Item(0, { A: 'a_row1', B: 'b_row1' }), new Item(0, { A: 'a_row2', B: 'b_row2' })];

  const trans1Desc = { requireColumns: ['A', 'B'] };
  const trans1Schema = ['C'];
  const trans1Items = parsedItems.map((item) => item.withData({ C: `c=${item.value('A')}+${item.value('B')}` }));

  const transformers = [new TestTransformer('Trans1', trans1Desc, trans1Schema, trans1Items)];
  const debug = new Debugger(parsedSchema, parsedItems, { fontMap: new Map(), pageViewports: [] }, transformers);

  expect(debug.stageNames).toEqual(['Parse Result', 'Trans1']);
  expect(debug.stageResults(0).schema).toEqual(parsedSchema.map((column) => ({ name: column })));
  expect(debug.stageResults(1).schema).toEqual([
    ...parsedSchema.map((column) => ({ name: column, annotation: ColumnAnnotation.REMOVED })),
    { name: 'C', annotation: ColumnAnnotation.ADDED },
  ]);
  expect(debug.stageResults(0).items).toEqual(parsedItems);
  expect(debug.stageResults(1).items).toEqual(trans1Items);
});

describe('build schemas', () => {
  const items: Item[] = [];

  function calculateSchema(inputSchema: string[], outputSchema: string[]): AnnotatedColumn[] {
    const transformers = [new TestTransformer('Trans1', {}, outputSchema, items)];
    const debug = new Debugger(inputSchema, items, { fontMap: new Map(), pageViewports: [] }, transformers);
    return debug.stageResults(1).schema;
  }

  test('Add', async () => {
    const annotatedSchema = calculateSchema(['A', 'B'], ['A', 'B', 'C']);
    expect(annotatedSchema).toEqual([{ name: 'A' }, { name: 'B' }, { name: 'C', annotation: ColumnAnnotation.ADDED }]);
  });

  test('Remove', async () => {
    const annotatedSchema = calculateSchema(['A', 'B'], ['A']);
    expect(annotatedSchema).toEqual([{ name: 'A' }, { name: 'B', annotation: ColumnAnnotation.REMOVED }]);
  });

  test('Replace first', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C'], ['X', 'B', 'C']);
    expect(annotatedSchema).toEqual([
      { name: 'A', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
      { name: 'B' },
      { name: 'C' },
    ]);
  });

  test('Replace middle', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C'], ['A', 'X', 'C']);
    expect(annotatedSchema).toEqual([
      { name: 'A' },
      { name: 'B', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
      { name: 'C' },
    ]);
  });

  test('Replace last', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C'], ['A', 'B', 'X']);
    expect(annotatedSchema).toEqual([
      { name: 'A' },
      { name: 'B' },
      { name: 'C', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
    ]);
  });

  test('Replace first with 2', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C'], ['X', 'Y', 'B', 'C']);
    expect(annotatedSchema).toEqual([
      { name: 'A', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
      { name: 'Y', annotation: ColumnAnnotation.ADDED },
      { name: 'B' },
      { name: 'C' },
    ]);
  });

  test('Replace middle with 2', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C'], ['A', 'X', 'Y', 'C']);
    expect(annotatedSchema).toEqual([
      { name: 'A' },
      { name: 'B', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
      { name: 'Y', annotation: ColumnAnnotation.ADDED },
      { name: 'C' },
    ]);
  });

  test('Replace last with 2', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C'], ['A', 'B', 'X', 'Y']);
    expect(annotatedSchema).toEqual([
      { name: 'A' },
      { name: 'B' },
      { name: 'C', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
      { name: 'Y', annotation: ColumnAnnotation.ADDED },
    ]);
  });

  test('Replace 2 with one', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C', 'D'], ['A', 'X', 'D']);
    expect(annotatedSchema).toEqual([
      { name: 'A' },
      { name: 'B', annotation: ColumnAnnotation.REMOVED },
      { name: 'C', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
      { name: 'D' },
    ]);
  });

  test('Replace all', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C'], ['X']);
    expect(annotatedSchema).toEqual([
      { name: 'A', annotation: ColumnAnnotation.REMOVED },
      { name: 'B', annotation: ColumnAnnotation.REMOVED },
      { name: 'C', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
    ]);
  });

  test('Wild mix all', async () => {
    const annotatedSchema = calculateSchema(['A', 'B', 'C', 'E', 'F', 'G'], ['B', 'X', 'E', 'Y', 'Z', 'G', 'XX']);
    expect(annotatedSchema).toEqual([
      { name: 'A', annotation: ColumnAnnotation.REMOVED },
      { name: 'B' },
      { name: 'C', annotation: ColumnAnnotation.REMOVED },
      { name: 'X', annotation: ColumnAnnotation.ADDED },
      { name: 'E' },
      { name: 'F', annotation: ColumnAnnotation.REMOVED },
      { name: 'Y', annotation: ColumnAnnotation.ADDED },
      { name: 'Z', annotation: ColumnAnnotation.ADDED },
      { name: 'G' },
      { name: 'XX', annotation: ColumnAnnotation.ADDED },
    ]);
  });
});

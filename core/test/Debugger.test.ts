import Debugger from 'src/Debugger';
import Item from 'src/Item';
import ItemTransformer from 'src/transformer/ItemTransformer';
import TransformerDescriptor from 'src/TransformerDescription';
import TransformContext from 'src/transformer/TransformContext';
import ItemResult from 'src/ItemResult';

class TestTransformer extends ItemTransformer {
  items: Item[];
  constructor(name: string, descriptor: TransformerDescriptor, outputSchema: string[], items: Item[]) {
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
  const debug = new Debugger(parsedSchema, parsedItems, { pageViewports: [] }, transformers);

  expect(debug.stageNames).toEqual(['Parse Result', 'Trans1']);
  expect(debug.stageSchema).toEqual([parsedSchema, ['C']]);
  expect(debug.stageResults(0).items).toEqual(parsedItems);
  expect(debug.stageResults(1).items).toEqual(trans1Items);
});

import Debugger from 'src/Debugger';
import Item from 'src/Item';
import ItemTransformer from 'src/transformer/ItemTransformer';
import Metadata from 'src/Metadata';
import ParseResult from 'src/ParseResult';
import TransformerDescription from 'src/TransformerDescription';
import TransformContext from 'src/transformer/TransformContext';

class TestTransformer extends ItemTransformer {
  items: Item[];
  constructor(name: string, description: TransformerDescription, items: Item[]) {
    super(name, description);
    this.items = items;
  }
  transform(_: TransformContext, items: Item[]): Item[] {
    return this.items;
  }
}

test('basic debug', async () => {
  const parsedSchema = ['A', 'B'];
  const parsedItems = [new Item(0, { A: 'a_row1', B: 'b_row1' }), new Item(0, { A: 'a_row2', B: 'b_row2' })];

  const trans1Desc = { consumes: ['A', 'B'], produces: ['C'], removes: ['A', 'B'] };
  const trans1Items = parsedItems.map((item) => item.withData({ C: `c=${item.value('A')}+${item.value('B')}` }));

  const transformers = [new TestTransformer('Trans1', trans1Desc, trans1Items)];
  const debug = new Debugger(parsedSchema, parsedItems, { pageViewports: [] }, transformers);

  expect(debug.stageNames).toEqual(['Parse Result', 'Trans1']);
  expect(debug.stageSchema).toEqual([parsedSchema, ['C']]);
  for (let index = 0; index < debug.stageNames.length; index++) {
    console.log(index, debug.stageResults(index));
  }

  expect(debug.stageResults(0)).toEqual(parsedItems);
  expect(debug.stageResults(1)).toEqual(trans1Items);
});

import TransformerDescription from '../TransformerDescription';
import type Item from '../Item';
import TransformContext from './TransformContext';
import ItemResult from 'src/ItemResult';

export default abstract class ItemTransformer {
  readonly name: string;
  readonly description: TransformerDescription;

  constructor(name: string, description: TransformerDescription) {
    this.name = name;
    this.description = {
      ...{
        consumesGlobels: [],
        producesGlobels: [],
        consumes: [],
        produces: [],
        removes: [],
      },
      ...description,
    };
  }

  // columnar-changes: described
  abstract transform(context: TransformContext, items: Item[]): ItemResult;
}

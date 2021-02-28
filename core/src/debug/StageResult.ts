import TransformDescriptor, { toDescriptor } from '../TransformDescriptor';
import AnnotatedColumn from './AnnotatedColumn';
import Item from '../Item';
import Page, { asPages } from './Page';
import ChangeIndex from './ChangeIndex';
import ChangeTracker from './ChangeTracker';

export default class StageResult {
  constructor(
    public descriptor: TransformDescriptor,
    public schema: AnnotatedColumn[],
    public pages: Page[],
    public changes: ChangeIndex,
    public messages: string[],
  ) {}

  itemsUnpacked(): Item[] {
    return this.pages.reduce((items: Item[], page: Page) => {
      page.itemGroups.forEach((itemGroup) => itemGroup.unpacked().forEach((item) => items.push(item)));
      return items;
    }, []);
  }
}

export function initialStage(inputSchema: string[], inputItems: Item[]): StageResult {
  const schema = inputSchema.map((column) => ({ name: column }));
  const tracker = new ChangeTracker();
  const pages = asPages(tracker, inputItems);
  const messages = [
    `Parsed ${inputItems.length === 0 ? 0 : inputItems[inputItems.length - 1].page + 1} pages with ${
      inputItems.length
    } items`,
  ];
  return new StageResult(toDescriptor({ debug: { showAll: true } }), schema, pages, tracker, messages);
}

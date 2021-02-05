import type Item from './Item';
import type Metadata from './Metadata';
import type PageViewport from './parse/PageViewport';

export default class ParseResult {
  pdfPages: any[];
  pageViewports: PageViewport[];
  metadata: Metadata;
  schema: string[];
  items: Item[];

  constructor(pdfPages: any[], pageViewports: PageViewport[], metadata: Metadata, schema: string[], items: Item[]) {
    this.pdfPages = pdfPages;
    this.pageViewports = pageViewports;
    this.metadata = metadata;
    this.schema = schema;
    this.items = items;
  }

  pageCount(): number {
    return this.pdfPages.length;
  }
}

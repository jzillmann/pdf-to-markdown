import type Item from './Item';
import type Metadata from './Metadata';
import type PageViewport from './parse/PageViewport';

export default class ParseResult {
  fontMap: Map<string, object>;
  pdfjsPages: any[];
  pageViewports: PageViewport[];
  metadata: Metadata;
  schema: string[];
  items: Item[];

  constructor(
    fontMap: Map<string, object>,
    pdfjsPages: any[],
    pageViewports: PageViewport[],
    metadata: Metadata,
    schema: string[],
    items: Item[],
  ) {
    this.fontMap = fontMap;
    this.pdfjsPages = pdfjsPages;
    this.pageViewports = pageViewports;
    this.metadata = metadata;
    this.schema = schema;
    this.items = items;
  }

  pageCount(): number {
    return this.pdfjsPages.length;
  }
}

import Item from './Item';
import type Metadata from './Metadata';

export default class ParseResult {
  pdfPages: any[];
  metadata: Metadata;
  columns: string[];
  items: Item[];

  constructor(pdfPages: any[], metadata: Metadata, columns: string[], items: Item[]) {
    this.pdfPages = pdfPages;
    this.metadata = metadata;
    this.columns = columns;
    this.items = items;
  }

  pageCount(): number {
    return this.pdfPages.length;
  }
}

import type Metadata from './Metadata';
import type ParsedPage from './ParsedPage';

export default class ParseResult {
  metadata: Metadata;
  pages: ParsedPage[];

  constructor(metadata: Metadata, pages: ParsedPage[]) {
    this.metadata = metadata;
    this.pages = pages;
  }
}

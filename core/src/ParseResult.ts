import Metadata from './Metadata';
import ParsedPage from './ParsedPage';

export default class ParseResult {
  metadata: Metadata;
  pages: ParsedPage[];

  constructor(metadata: Metadata, pages: ParsedPage[]) {
    this.metadata = metadata;
    this.pages = pages;
  }
}

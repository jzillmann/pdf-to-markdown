import type ParsedPageItem from './ParsedPageItem';

export default class ParsedPage {
  index: number;
  pdfPage: any;
  items: ParsedPageItem[];

  constructor(index: number, pdfPage: any, items: ParsedPageItem[]) {
    this.index = index;
    this.pdfPage = pdfPage;
    this.items = items;
  }
}

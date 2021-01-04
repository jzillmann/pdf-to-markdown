import type ParsedPageItem from './ParsedPageItem';

export default class ParsedPage {
  index: number;
  viewPortTransform: number[];
  items: ParsedPageItem[];

  constructor(index: number, viewPortTransform: number[], items: ParsedPageItem[]) {
    this.index = index;
    this.viewPortTransform = viewPortTransform;
    this.items = items;
  }
}

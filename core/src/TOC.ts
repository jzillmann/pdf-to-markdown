import Item from './Item';

/**
 * Table of contents usually parsed by  `DetectToc.ts`.
 */
export default class TOC {
  //TODO optional title
  constructor(public pages: number[], public entries: TocEntry[]) {}

  startPage(): number {
    return Math.min(...this.pages);
  }

  endPage(): number {
    return Math.max(...this.pages);
  }
}

export interface TocEntry {
  level: number;
  text: string;
  linkedPage: number;
  items: Item[];
}

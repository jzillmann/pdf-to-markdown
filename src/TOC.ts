import Item from './Item';
import ItemType from './ItemType';

/**
 * Table of contents usually parsed by  `DetectToc.ts`.
 */
export default class TOC {
  constructor(public tocHeadlineItems: Item[], public pages: number[], public detectedHeadlineLevels: Set<ItemType>) {}

  startPage(): number {
    return Math.min(...this.pages);
  }

  endPage(): number {
    return Math.max(...this.pages);
  }
}

/**
 * Holds the information which (zero based) page index maps to a page number.
 */
export default class PageMapping {
  constructor(public pageFactor: number, public detectedOnPage: boolean) {}

  /**
   * Translates a given page index to a page number label as printed on the page. E.g [0,1,2,3,4] could become [I, II, 1, 2].
   * @param pageIndex
   */
  pageLabel(pageIndex: number) {
    const pageNumber = pageIndex + this.pageFactor;
    if (pageNumber < 0) {
      return romanize(pageNumber - this.pageFactor + 1);
    }
    return `${pageNumber + 1}`;
  }
}

function romanize(num: number): string {
  var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 },
    roman = '',
    i: string;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

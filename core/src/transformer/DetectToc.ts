import ItemTransformer from './ItemTransformer';
import GlobalDefinition from '../GlobalDefinition';
import Item from '../Item';
import ItemResult from '../ItemResult';
import TransformContext from './TransformContext';
import LineItemMerger from '../debug/LineItemMerger';
import { groupByLine, groupByPage, onlyUniques, transformGroupedByPage } from '../support/groupingUtils';
import { MOST_USED_HEIGHT, PAGE_MAPPING } from './CacluclateStatistics';
import { extractEndingNumber, filterOutWhitespaces } from '../support/stringFunctions';
import ItemType from '../ItemType';
import { numbersAreConsecutive } from '../support/numberFunctions';
import TOC, { TocEntry } from '../TOC';
import FontType from '../FontType';
import { flatten, groupBy } from '../support/functional';
import { getHeight, getText, getFontName, itemWithType } from '../support/items';

const config = {
  // How many characters a line with a ending number needs to have minimally to be a valid link
  linkMinLength: 5,
};

export const TOC_GLOBAL = new GlobalDefinition<TOC>('toc');

export default class DetectToc extends ItemTransformer {
  constructor() {
    super(
      'Detect TOC',
      'Detect table of contents.',
      {
        requireColumns: ['x', 'y', 'str', 'line'],
        producesGlobels: [TOC_GLOBAL.key],
        debug: {
          itemMerger: new LineItemMerger(),
        },
      },
      (incomingSchema) => {
        return incomingSchema.reduce((schema, column) => {
          if (column === 'x') {
            return [...schema, 'types', 'x'];
          }
          return [...schema, column];
        }, new Array<string>());
      },
    );
  }

  transform(context: TransformContext, inputItems: Item[]): ItemResult {
    const pageMapping = context.getGlobal(PAGE_MAPPING);
    const mostUsedHeight = context.getGlobal(MOST_USED_HEIGHT);
    const maxPageToEvaluate = Math.min(context.pageCount / 2, 5 + Math.abs(pageMapping.pageFactor));
    const pagesToEvaluate = groupByPage(inputItems.filter((item) => item.page <= maxPageToEvaluate));
    const maxPageToBeLinkedTo = context.pageCount + pageMapping.pageFactor - 1;

    const tocArea = findTocArea(pagesToEvaluate, context.pageCount, maxPageToBeLinkedTo);

    if (!tocArea) {
      return { items: inputItems, messages: ['No Table of Contents found!'] };
    }

    const rawTocEntries = selectRawTocEntries(tocArea, inputItems);
    const tocItemUuids: Set<string> = new Set(
      flatten(flatten(rawTocEntries.map((e) => e.entryLines))).map((item) => item.uuid),
    );
    const tocEntries: TocEntry[] = rawTocEntries.map((rawEntry) => {
      const headline = findHeadline(
        context.fontMap,
        inputItems,
        mostUsedHeight,
        rawEntry.linkedPage - pageMapping.pageFactor,
        rawEntry.entryLines,
      );
      return {
        level: 0,
        text:
          headline ||
          flatten(rawEntry.entryLines)
            .map((item) => getText(item))
            .join('')
            .replace(/[\s.]+\w+$/, ''),
        verified: !!headline,
        linkedPage: rawEntry.linkedPage,
        items: flatten(rawEntry.entryLines),
      };
    });

    return {
      items: inputItems.map((item) => {
        if (tocArea.pages.includes(item.page) && tocItemUuids.has(item.uuid)) {
          return itemWithType(item, ItemType.TOC);
        }
        return item;
      }),
      messages: [`Detected ${tocEntries.length} TOC entries`],
      globals: [TOC_GLOBAL.value(new TOC(tocArea.pages, tocEntries))],
    };
  }
}

function findTocArea(pagesToEvaluate: Item[][], pageCount: number, maxPageToBeLinkedTo: number): TocArea | undefined {
  const linesWithNumber: LineWithNumber[] = [];
  pagesToEvaluate.forEach((pageItems) => {
    const itemsGroupedByLine = groupByLine(pageItems);
    itemsGroupedByLine.forEach((lineItems) => {
      const number = findEndingNumber(lineItems);
      if (
        number &&
        Number.isInteger(number) &&
        number > 0 &&
        number <= maxPageToBeLinkedTo &&
        lineItems.map((item) => item.data['str']).join('').length > config.linkMinLength
      ) {
        const page = lineItems[0].page;
        const startItemUuid = lineItems[0].uuid;
        const y = lineItems[0].data['y'];
        linesWithNumber.push({ page, startItemUuid, y, number });
      }
    });
  });

  if (linesWithNumber.length <= 0) {
    return undefined;
  }

  const lineNumberClusters = linesWithNumber.reduce(
    (arrayOfAscendingNumberArrays: LineWithNumber[][], lineWithNumber) => {
      if (arrayOfAscendingNumberArrays.length == 0) {
        return [[lineWithNumber]];
      }
      const lastArray = arrayOfAscendingNumberArrays[arrayOfAscendingNumberArrays.length - 1];
      const lastNumber = lastArray[lastArray.length - 1];
      if (lineWithNumber.number >= lastNumber.number) {
        lastArray.push(lineWithNumber);
      } else {
        arrayOfAscendingNumberArrays.push([lineWithNumber]);
      }
      return arrayOfAscendingNumberArrays;
    },
    [],
  );

  lineNumberClusters.sort((a, b) => b.length - a.length);
  if (lineNumberClusters[0].length < 3) {
    return undefined;
  }

  const selectedLines = lineNumberClusters[0];
  const pages = selectedLines.map((l) => l.page).filter(onlyUniques);
  if (!numbersAreConsecutive(pages)) {
    return undefined;
  }
  if (pages.length > selectedLines.length / 5) {
    return undefined;
  }

  return {
    pages,
    linesWithNumbers: selectedLines,
  };
}

function findEndingNumber(lineItems: Item[]): number | undefined {
  const text = lineItems
    .reduce((text, item) => {
      return text + item.data['str'];
    }, '')
    .trim();
  return extractEndingNumber(text);
}

function selectRawTocEntries(tocArea: TocArea, inputItems: Item[]): RawTocEntry[] {
  const numbersByStartUuid = tocArea.linesWithNumbers.reduce((map: Map<string, number>, l) => {
    map.set(l.startItemUuid, l.number);
    return map;
  }, new Map());

  const itemsInTocArea = inputItems.filter((item) => tocArea.pages.includes(item.page));
  const itemsInTocAreaByLine = groupByLine(itemsInTocArea);

  const maxHeightOfNumberedLines = Math.max(
    ...itemsInTocAreaByLine
      .reduce((lineHeights: number[], lineItems) => {
        if (numbersByStartUuid.has(lineItems[0].uuid)) {
          lineHeights.push(Math.max(...lineItems.map((line) => line.data['height'])));
        }
        return lineHeights;
      }, [])
      .filter(onlyUniques),
  );
  const maxLinesBetweenLinesWithNumbers = Math.max(
    ...itemsInTocAreaByLine
      .reduce((lineDistance: number[], lineItems) => {
        if (numbersByStartUuid.has(lineItems[0].uuid)) {
          lineDistance.push(-1);
        }
        if (lineDistance.length > 0) {
          lineDistance[lineDistance.length - 1]++;
        }
        return lineDistance;
      }, [])
      .filter(onlyUniques),
  );
  const linesWithNumbersByPage = groupBy(tocArea.linesWithNumbers, (line) => line.page);
  const maxYBetweenLinesWithNumbers = Math.max(
    ...linesWithNumbersByPage.map((pageLines) => {
      return pageLines.reduce(
        (previous: { y: number; distance: number }, line) => {
          const y = line.y;
          if (previous.y == -1) {
            return { y, distance: -1 };
          }
          return {
            y,
            distance: Math.max(Math.abs(y - previous.y), previous.distance),
          };
        },
        { y: -1, distance: -1 },
      ).distance;
    }),
  );
  const rawTocEntries: RawTocEntry[] = [];
  itemsInTocAreaByLine.reduce((beforeLines: Item[][], lineItems) => {
    const number = numbersByStartUuid.get(lineItems[0].uuid);
    if (!number) {
      beforeLines.push(lineItems);
      return beforeLines;
    }
    const validBeforeLines = beforeLines.filter((beforLine, beforeIndex) => {
      const yDistance = Math.abs(beforLine[0].data['y'] - lineItems[0].data['y']);
      const beforLineHeight = Math.max(...beforLine.map((item) => item.data['height']));
      const beforeLineMuchLarger = beforLineHeight > maxHeightOfNumberedLines;
      return (
        !beforeLineMuchLarger &&
        beforeLines.length - beforeIndex <= maxLinesBetweenLinesWithNumbers &&
        yDistance <= maxYBetweenLinesWithNumbers
      );
    });
    const entryLines = [...validBeforeLines, lineItems];
    rawTocEntries.push({
      linkedPage: number,
      entryLines,
    });
    return [];
  }, []);

  return rawTocEntries;
}

function findHeadline(
  fontMap: Map<string, object>,
  items: Item[],
  mostUsedHeight: number,
  targetPage: number,
  entryLines: Item[][],
): string | undefined {
  const tocEntryText = normalizeHeadlineChars(
    entryLines.map((lineItems) => lineItems.map((item) => getText(item)).join('')).join(''),
  );
  const pageItems = items.filter((item) => item.page == targetPage);
  const possibleHeadlines = pageItems.filter(
    (item) =>
      getHeight(item) > mostUsedHeight + config.minHeadlineDistance ||
      FontType.declaredFontTypes(getFontName(fontMap, item)).includes(FontType.BOLD),
  );
  let hits = possibleHeadlines.filter((item) => {
    return tocEntryText.includes(normalizeHeadlineChars(getText(item)));
  });

  if (hits.length > 0) {
    return hits
      .map((hit) => getText(hit))
      .join('')
      .trim();
  }

  return undefined;
}

function normalizeHeadlineChars(text: string) {
  return filterOutWhitespaces(text).toLowerCase();
}

/**
 * Pointer to pages/items which classified as TOC.
 */
interface TocArea {
  pages: number[];
  linesWithNumbers: LineWithNumber[];
}

/**
 * Contains the page number and all attached lines of items,
 */
interface RawTocEntry {
  linkedPage: number;
  entryLines: Item[][];
}

/**
 * A (item[]) line which ends with a number.
 */
interface LineWithNumber {
  page: number;
  startItemUuid: string;
  y: number;
  number: number;
}

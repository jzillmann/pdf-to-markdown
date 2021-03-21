import { toMatchFile } from 'jest-file-snapshot';

import * as pdfjs from 'pdfjs-dist/es5/build/pdf';
import * as fs from 'fs';

import PdfParser from 'src/PdfParser';
import PdfPipeline from 'src/PdfPipeline';
import { transformers } from 'src/index';
import Debugger from 'src/Debugger';
import Item from 'src/Item';

const parser = new PdfParser(pdfjs);
const pipeline = new PdfPipeline(parser, transformers);

const folder = '../examples';
const files = fs.readdirSync(folder).filter((file) => file.endsWith('.pdf'));

expect.extend({ toMatchFile });

describe.each(files)('Test %p', (file) => {
  const data = fs.readFileSync(`${folder}/${file}`);

  let debug: Debugger;
  beforeAll(async () => (debug = await pipeline.debug(data, () => {})));

  test.each(transformers.map((t) => t.name).filter((name) => name !== 'Does nothing'))(
    'stage %p',
    (transformerName) => {
      const stageResults = debug.stageResults(debug.stageNames.indexOf(transformerName));

      const chunkedLines: string[][] = [[]];
      let resultIndex = 0;
      let collectedItems = 0;
      stageResults.selectPages(true, true).forEach((page) => {
        page.itemGroups.forEach((itemGroup) => {
          const change = stageResults.changes.change(itemGroup.top);
          if (change || stageResults.descriptor.debug?.showAll) {
            const item = itemGroup.top;
            const changeType = change?.constructor.name || 'none';
            chunkedLines[resultIndex].push(itemToString(debug.fontMap, item, changeType));
            collectedItems++;
          }
        });

        // we split results to multiple files to circumvent githubs 100MB limit
        resultIndex = Math.floor(collectedItems / 450_000);
        if (resultIndex === chunkedLines.length) {
          chunkedLines.push([]);
        }
      });

      // Global characteristics
      let groupedItemCount = stageResults
        .selectPages(false, true)
        .reduce((itemCount, page) => itemCount + page.itemGroups.length, 0);
      chunkedLines[0].unshift(
        JSON.stringify(
          {
            pages: stageResults.pages.length,
            items: stageResults.itemsUnpacked().length,
            groupedItems: groupedItemCount,
            changes: stageResults.changes.changeCount(),
            schema: stageResults.schema,
            // messages: stageResults.messages,
          },
          null,
          2,
        ),
      );

      chunkedLines.forEach((lines, idx) => {
        const transformerResultAsString = lines.join('\n') || '{}';
        const resultFolder = `${folder}/${file.substr(0, file.length - 4)}`;
        const fileName = `${transformerName[0].toLowerCase() + transformerName.slice(1).replace(/\s/g, '')}`;
        const fileIndex = chunkedLines.length > 1 ? `.${idx}` : '';
        const resultFile = `${resultFolder}/${fileName}${fileIndex}.json`;
        expect(transformerResultAsString).toMatchFile(resultFile);
      });
    },
  );
});

function itemToString(fontMap: Map<string, object>, item: Item, changeType: string): string {
  const fontName: string | Array<string> = item.data['fontName'];
  let newFontName: string | Array<string> | undefined = undefined;
  if (fontName) {
    if (typeof fontName === 'string') {
      newFontName = fontMap.get(fontName)?.['name'] as string;
    } else {
      newFontName = fontName.map((name) => fontMap.get(name)?.['name']);
    }
  }
  const transform: undefined | number[] = item.data['transform'];
  let newTransform;
  if (transform) {
    newTransform = transform.map((num) => num.toFixed(2));
  }
  return JSON.stringify({
    page: item.page,
    change: changeType,
    ...item.data,
    fontName: newFontName,
    height: item.data['height'].toFixed(2),
    width: item.data['width'].toFixed(2),
    transform: newTransform,
  });
}

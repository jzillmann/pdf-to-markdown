import { toMatchFile } from 'jest-file-snapshot';

import * as pdfjs from 'pdfjs-dist/es5/build/pdf';
import * as fs from 'fs';
import * as path from 'path';

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

  test.each(transformers.map((t) => t.name))('stage %p', (transformerName) => {
    const stageResults = debug.stageResults(debug.stageNames.indexOf(transformerName));
    const lines: string[] = [];
    let groupedItemCount = stageResults
      .selectPages(false, true)
      .reduce((itemCount, page) => itemCount + page.itemGroups.length, 0);
    stageResults.selectPages(true, true).forEach((page) => {
      page.itemGroups.forEach((itemGroup) => {
        const change = stageResults.changes.change(itemGroup.top);
        if (change || stageResults.descriptor.debug?.showAll) {
          const item = itemGroup.top;
          const changeType = change?.constructor.name || 'none';
          lines.push(JSON.stringify({ page: item.page, change: changeType, data: item.data }));
        }
      });
    });
    lines.unshift(
      JSON.stringify(
        {
          pages: stageResults.pages.length,
          items: stageResults.itemsUnpacked().length,
          groupedItems: groupedItemCount,
          changes: stageResults.changes.changeCount(),
          schema: stageResults.schema,
          messages: stageResults.messages,
        },
        null,
        2,
      ),
    );
    const transformerResultAsString = lines.join('\n') || '{}';
    const resultFolder = `${folder}/${file.substr(0, file.length - 4)}`;
    const resultFile = `${resultFolder}/${
      transformerName[0].toLowerCase() + transformerName.slice(1).replace(/\s/g, '')
    }.json`;
    expect(transformerResultAsString).toMatchFile(resultFile);
  });
});

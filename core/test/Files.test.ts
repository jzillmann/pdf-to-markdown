import { toMatchFile } from 'jest-file-snapshot';

import * as pdfjs from 'pdfjs-dist/es5/build/pdf';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';

import PdfParser from 'src/PdfParser';
import PdfPipeline from 'src/PdfPipeline';
import { transformers } from 'src/index';
import Debugger from 'src/Debugger';
import Item from 'src/Item';
import RemoveRepetitiveItems from 'src/transformer/RemoveRepetitiveItems';
import StageResult from 'src/debug/StageResult';
import EvaluationIndex from 'src/debug/EvaluationIndex';
import { Change } from 'src/debug/ChangeIndex';
import DetectToc from 'src/transformer/DetectToc';

const parser = new PdfParser(pdfjs);
const pipeline = new PdfPipeline(parser, transformers);

const folder = '../examples';
const files = fs.readdirSync(folder).filter((file) => file.endsWith('.pdf'));
const urls = [
  'https://homepages.cwi.nl/~lex/files/dict.pdf',
  'https://github.com/mozilla/pdf.js/raw/master/web/compressed.tracemonkey-pldi-09.pdf',
];
const downloadCache = 'node_modules/.cache/files';

expect.extend({ toMatchFile });

// Test is for debugging purpose
test.skip('Debug', async () => {
  const data = fs.readFileSync(`${folder}/Adventures-Of-Sherlock-Holmes.pdf`);
  await pipeline.execute(data, () => {});
});

describe.each(files)('Test %p', (file) => {
  const data = fs.readFileSync(`${folder}/${file}`);

  let debug: Debugger;
  beforeAll(async () => (debug = await pipeline.debug(data, () => {})));

  test.each(transformers.map((t) => t.name).filter((name) => name !== 'Does nothing'))(
    'stage %p',
    (transformerName) => {
      const stageResult = debug.stageResult(debug.stageNames.indexOf(transformerName));
      const chunkedLines: string[][] = [[]];
      let resultIndex = 0;
      let collectedItems = 0;
      stageResult.selectPages(true, true).forEach((page) => {
        page.itemGroups.forEach((itemGroup) => {
          const item = itemGroup.top;
          const change = stageResult.changes.change(item);
          if (change || stageResult.descriptor.debug?.showAll) {
            chunkedLines[resultIndex].push(itemToString(debug.fontMap, item, change, stageResult.evaluations));
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
      chunkedLines[0].unshift(toHeader(stageResult));

      chunkedLines.forEach((lines, idx) => {
        const transformerResultAsString = lines.join('\n') || '{}';
        expect(transformerResultAsString).toMatchFile(matchFilePath(file, transformerName, chunkedLines.length, idx));
      });
    },
  );
});

function matchFilePath(pdfFileName: string, transformerName: string, chunkCount = 1, chunkIndex = 0): string {
  const pdfFileNameWithoutExtension = pdfFileName.substr(0, pdfFileName.length - 4);
  const resultFileName = `${transformerName[0].toLowerCase() + transformerName.slice(1).replace(/\s/g, '')}`;
  const fileIndex = chunkCount > 1 ? `.${chunkIndex}` : '';
  return `${folder}/${pdfFileNameWithoutExtension}/${resultFileName}${fileIndex}.json`;
}

describe('Selective transforms on URL PDFs', () => {
  const transformerNames = [new RemoveRepetitiveItems().name, new DetectToc().name];
  test.each(urls)('URL %p', async (url) => {
    const { fileName, data } = download(url);
    const debug = await pipeline.debug(data, () => {});

    transformerNames.forEach((transformerName) => {
      const stageResult = debug.stageResult(debug.stageNames.indexOf(transformerName));
      const pages = stageResult.selectPages(true, true);

      const lines: string[] = [];
      lines.push(toHeader(stageResult));

      pages.forEach((page) =>
        page.itemGroups.forEach((itemGroup) => {
          const item = itemGroup.top;
          const change = stageResult.changes.change(item);
          if (change) {
            lines.push(itemToString(debug.fontMap, item, change, stageResult.evaluations));
          }
        }),
      );

      const transformerResultAsString = lines.join('\n') || '{}';
      expect(transformerResultAsString).toMatchFile(matchFilePath(fileName, transformerName));
    });
  });
});

function toHeader(stageResult: StageResult): string {
  let groupedItemCount = stageResult
    .selectPages(false, true)
    .reduce((itemCount, page) => itemCount + page.itemGroups.length, 0);

  return JSON.stringify(
    {
      pages: stageResult.pages.length,
      items: stageResult.itemsUnpacked().length,
      groupedItems: groupedItemCount,
      changes: stageResult.changes.changeCount(),
      schema: stageResult.schema,
      globals: mapToObject(stageResult.globals.map),
      // messages: stageResults.messages,
    },
    null,
    2,
  );
}

function mapToObject(map: Map<any, any>): object {
  return Array.from(map).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
}

function itemToString(
  fontMap: Map<string, object>,
  item: Item,
  change: Change | undefined,
  evaluationIndex: EvaluationIndex,
): string {
  const fontName: string | Array<string> = item.data['fontName'];
  let newFontName: string | Array<string> | undefined = undefined;
  if (fontName) {
    if (typeof fontName === 'string') {
      newFontName = fontMap.get(fontName)?.['name'] as string;
    } else {
      newFontName = fontName.map((name) => fontMap.get(name)?.['name']);
    }
  }
  const changeType = change?.constructor.name || 'none';
  const transform: undefined | number[] = item.data['transform'];
  let newTransform: undefined | string[];
  if (transform) {
    newTransform = transform.map((num) => num.toFixed(2));
  }

  const object = {
    page: item.page,
    change: changeType,
    score: evaluationIndex.evaluationScore(item),
    ...item.data,
    fontName: newFontName,
    height: item.data['height'].toFixed(2),
    width: item.data['width'].toFixed(2),
    transform: newTransform,
  };
  if (!evaluationIndex.hasScores()) {
    delete object.score;
  }
  return JSON.stringify(object);
}

function download(url: string): { fileName: string; data: Buffer } {
  const fileName = path.basename(new URL(url).pathname);
  const localFilePath = `${downloadCache}/${fileName}`;
  if (!fs.existsSync(localFilePath)) {
    fs.mkdirSync(downloadCache, { recursive: true });
    downloadToFile(url, localFilePath);
  }
  return {
    fileName,
    data: fs.readFileSync(localFilePath),
  };
}

function downloadToFile(url: string, dest: string): Promise<void> {
  const uri = new URL(url);
  const pkg = url.toLowerCase().startsWith('https:') ? https : http;

  return new Promise((resolve, reject) => {
    pkg.get(uri.href).on('response', (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest, { flags: 'wx' });
        res
          .on('end', () => {
            file.end();
            resolve();
          })
          .on('error', (err) => {
            file.destroy();
            fs.unlink(dest, () => reject(err));
          })
          .pipe(file);
      } else if (res.statusCode === 302 || res.statusCode === 301) {
        // Recursively follow redirects, only a 200 will resolve.
        downloadToFile(res.headers.location as string, dest).then(() => resolve());
      } else {
        reject(new Error(`Download request failed, response status: ${res.statusCode} ${res.statusMessage}`));
      }
    });
  });
}

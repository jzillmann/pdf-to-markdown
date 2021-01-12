import PdfParser from 'src/PdfParser';
import * as pdfjs from 'pdfjs-dist/es5/build/pdf';
import * as fs from 'fs';
import ParseProgressReporter from 'src/ParseProgressReporter';
import Progress from 'src/Progress';

const parser = new PdfParser(pdfjs);

test('basic example PDF parse', async () => {
  const progressUpdates: Progress[] = [];
  const data = fs.readFileSync('../examples/ExamplePdf.pdf', null);
  const result = await parser.parseBytes(
    data,
    new ParseProgressReporter((progress) => progressUpdates.push(JSON.parse(JSON.stringify(progress)) as Progress)),
  );
  const expectedPages = 7;
  expect(result.metadata.title()).toEqual('ExamplePdf');
  expect(result.metadata.author()).toEqual('Johannes Zillmann');
  expect(result.pages.length).toBe(expectedPages);
  expect(result.pages[0].index).toBe(0);
  expect(result.pages[0].viewPortTransform).toEqual([1, 0, 0, -1, 0, 841.8898]);
  expect(result.pages[0].items).toEqual([
    {
      str: 'Mega Überschrift',
      dir: 'ltr',
      width: 245.05800000000005,
      height: 30,
      transform: [30, 0, 0, 30, 175, 756],
      fontName: 'g_d0_f1',
    },
    {
      str: '2te Überschrift',
      dir: 'ltr',
      width: 130.056,
      height: 20,
      transform: [20, 0, 0, 20, 233, 665],
      fontName: 'g_d0_f2',
    },
    {
      str: 'Dies ist eine Test-PDF',
      dir: 'ltr',
      width: 108.61950000000003,
      height: 11,
      transform: [11, 0, 0, 11, 240, 585],
      fontName: 'g_d0_f2',
    },
    {
      str: '.',
      dir: 'ltr',
      width: 3.0580000000000003,
      height: 11,
      transform: [11, 0, 0, 11, 352.6927, 585],
      fontName: 'g_d0_f2',
    },
    {
      str: '1',
      dir: 'ltr',
      width: 4.077333704,
      height: 7.333334,
      transform: [7.333334, 0, 0, 7.333334, 348, 588],
      fontName: 'g_d0_f2',
    },
    {
      str: 'Für’s Testen des ',
      dir: 'ltr',
      width: 83.7826,
      height: 11,
      transform: [11, 0, 0, 11, 208, 572],
      fontName: 'g_d0_f2',
    },
    {
      str: 'Markdown Parsers',
      dir: 'ltr',
      width: 91.6982,
      height: 11,
      transform: [11, 0, 0, 11, 291.77832, 572],
      fontName: 'g_d0_f2',
    },
    {
      str: '.',
      dir: 'ltr',
      width: 3.0580000000000003,
      height: 11,
      transform: [11, 0, 0, 11, 383.47360000000003, 572],
      fontName: 'g_d0_f2',
    },
    {
      str: ' ',
      dir: 'ltr',
      width: 3.0580000000000003,
      height: 11,
      transform: [11, 0, 0, 11, 61.078451, 59],
      fontName: 'g_d0_f2',
    },
    {
      str: 'In Deutsch.',
      dir: 'ltr',
      width: 55.64240000000001,
      height: 11,
      transform: [11, 0, 0, 11, 64.134603, 59],
      fontName: 'g_d0_f2',
    },
    {
      str: '1',
      dir: 'ltr',
      width: 4.077333704,
      height: 7.333334,
      transform: [7.333334, 0, 0, 7.333334, 57, 62],
      fontName: 'g_d0_f2',
    },
    {
      str: '\x00',
      dir: 'ltr',
      width: 0,
      height: 12,
      transform: [12, 0, 0, 12, 294, 45],
      fontName: 'g_d0_f3',
    },
    {
      str: '1',
      dir: 'ltr',
      width: 6.672000000000001,
      height: 12,
      transform: [12, 0, 0, 12, 294, 45],
      fontName: 'g_d0_f2',
    },
  ]);

  expect(progressUpdates.length).toBe(expectedPages + 2);
  progressUpdates.forEach((update) => expect(update.stages).toEqual(['Document Header', 'Metadata', 'Pages', 'Fonts']));
  expect(progressUpdates[0].stageProgress).toEqual([1, 0, 0, 0]);
  expect(progressUpdates[0].stageDetails).toEqual([null, null, `0 / ${expectedPages}`, null]);

  expect(progressUpdates[1].stageProgress).toEqual([1, 1, 0, 0]);
  expect(progressUpdates[1].stageDetails).toEqual([null, null, `0 / ${expectedPages}`, null]);

  expect(progressUpdates[2].stageProgress).toEqual([1, 1, 1 / expectedPages, 0]);
  expect(progressUpdates[2].stageDetails).toEqual([null, null, `1 / ${expectedPages}`, null]);
  expect(progressUpdates[3].stageProgress).toEqual([1, 1, 2 / expectedPages, 0]);
  expect(progressUpdates[3].stageDetails).toEqual([null, null, `2 / ${expectedPages}`, null]);
  expect(progressUpdates[4].stageProgress).toEqual([1, 1, 3 / expectedPages, 0]);
  expect(progressUpdates[4].stageDetails).toEqual([null, null, `3 / ${expectedPages}`, null]);
  expect(progressUpdates[5].stageProgress).toEqual([1, 1, 4 / expectedPages, 0]);
  expect(progressUpdates[5].stageDetails).toEqual([null, null, `4 / ${expectedPages}`, null]);
  expect(progressUpdates[6].stageProgress).toEqual([1, 1, 5 / expectedPages, 0]);
  expect(progressUpdates[6].stageDetails).toEqual([null, null, `5 / ${expectedPages}`, null]);
  expect(progressUpdates[7].stageProgress).toEqual([1, 1, 6 / expectedPages, 0]);
  expect(progressUpdates[7].stageDetails).toEqual([null, null, `6 / ${expectedPages}`, null]);
  expect(progressUpdates[8].stageProgress).toEqual([1, 1, 7 / expectedPages, 0]);
  expect(progressUpdates[8].stageDetails).toEqual([null, null, `7 / ${expectedPages}`, null]);

  // expect(progressUpdates[9].stagePercents).toEqual([1, 1, 1, 0]);
  // expect(progressUpdates[9].stageDetails).toEqual([null, null, `${expectedPages} / ${expectedPages}`, null]);
});

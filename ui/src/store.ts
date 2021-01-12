import { pdfParser, parseReporter } from '@core';
import type ProgressListenFunction from '@core/ProgressListenFunction';
import type ParseResult from '@core/ParseResult';
import * as pdfjs from 'pdfjs-dist/es5/build/pdf';

import { Writable, writable } from 'svelte/store';

export let parseResult: Writable<ParseResult> = writable(undefined);

pdfjs.GlobalWorkerOptions.workerSrc = 'worker/pdf.worker.min.js';

const parser = pdfParser(pdfjs);

export async function loadExample(progressListener: ProgressListenFunction): Promise<ParseResult> {
    return parsePdf(parser.parseUrl('/ExamplePdf.pdf', parseReporter(progressListener)));
}

export async function processUpload(file: File, progressListener: ProgressListenFunction): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(file);
    }).then((buffer) => {
        const data = new Uint8Array(buffer as ArrayBuffer);
        return parsePdf(parser.parseBytes(data, parseReporter(progressListener)));
    });
}

async function parsePdf(parsePromise: Promise<ParseResult>): Promise<ParseResult> {
    return parsePromise.then((result) => {
        parseResult.set(result);
        return result;
    });
}

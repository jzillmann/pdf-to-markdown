import { pdfParser } from '@core';
import type ParseResult from '@core/ParseResult';
import * as pdfjs from 'pdfjs-dist/es5/build/pdf';

import { Writable, writable } from 'svelte/store';

export let parseResult: Writable<ParseResult> = writable(undefined);

// TODO this will setup fake worker cause getMainThreadWorkerMessageHandler isn't null
import pdfjsWorker from 'pdfjs-dist//es5/build/pdf.worker.entry';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const parser = pdfParser(pdfjs);

export async function loadExample(): Promise<ParseResult> {
    return parsePdf(parser.parseUrl('/ExamplePdf.pdf'));
}

export async function processUpload(file: File): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(file);
    }).then((buffer) => {
        const data = new Uint8Array(buffer as ArrayBuffer);
        return parsePdf(parser.parseBytes(data));
    });
}

async function parsePdf(parsePromise: Promise<ParseResult>): Promise<ParseResult> {
    return parsePromise.then((result) => {
        parseResult.set(result);
        return result;
    });
}

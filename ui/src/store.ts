import { pdfParser, createPipeline, parseReporter } from '@core';
import type ProgressListenFunction from '@core/ProgressListenFunction';
import type ParseResult from '@core/ParseResult';
import type Debugger from '@core/Debugger';
import * as pdfjs from 'pdfjs-dist/es5/build/pdf';

import { Writable, writable } from 'svelte/store';

export let debug: Writable<Debugger> = writable(undefined);
export let parseResult: Writable<ParseResult> = writable(undefined);

pdfjs.GlobalWorkerOptions.workerSrc = `worker/pdf.worker.min.js`;

const pdfPipeline = createPipeline(pdfjs, {});

export async function loadExample(progressListener: ProgressListenFunction): Promise<any> {
    return parsePdf('ExamplePdf.pdf', progressListener);
}

export async function processUpload(file: File, progressListener: ProgressListenFunction): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(file);
    }).then((buffer) => {
        const data = new Uint8Array(buffer as ArrayBuffer);
        return parsePdf(data, progressListener);
    });
}

async function parsePdf(src: string | Uint8Array, progressListener: ProgressListenFunction): Promise<any> {
    pdfPipeline.debug(src, progressListener).then((debugInstance) => {
        debug.set(debugInstance);
        return debug;
    });
    //TODO without debug-flag
    // return pdfPipeline.execute(src, progressListener).then((result) => {
    //     parseResult.set(result);
    //     return result;
    // });
}

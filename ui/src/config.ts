import { Writable, writable } from 'svelte/store';
import { debugFromParams, debugStageFromParams } from './processParameters';

export const debugEnabled = storedWritable('debugEnabled', false, debugFromParams);
export const debugStage = storedWritable('debugStage', 0, debugStageFromParams);

function storedWritable<T>(key: string, defaultValue: T, paramLoadFunction: (defaultValue: T) => T): Writable<T> {
    const value = paramLoadFunction(fromLocalStore(key, defaultValue));
    const store = writable(value);
    store.subscribe((value) => {
        localStorage.setItem(key, JSON.stringify(value));
    });
    return store;
}

function fromLocalStore<T>(key: string, defaultValue: T): T {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null || storedValue === 'null') {
        return defaultValue;
    }
    return JSON.parse(storedValue);
}

import { Writable, writable } from 'svelte/store';

export const debugEnabled = storedWritable('debugEnabled', false);
export const debugStage = storedWritable('debugStage', 0);

function storedWritable<T>(key: string, defaultValue: T): Writable<T> {
    const store = writable(fromLocalStore(key, defaultValue));
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

import { assert } from '../assert';

const MIN_DIGIT_CHAR_CODE = 48;
const MAX_DIGIT_CHAR_CODE = 57;

export function isDigit(charCode: number): boolean {
  return charCode >= MIN_DIGIT_CHAR_CODE && charCode <= MAX_DIGIT_CHAR_CODE;
}

export function toCharcodes(text: string): number[] {
  const codes: number[] = [];
  for (let index = 0; index < text.length; index++) {
    codes.push(text.charCodeAt(index));
  }
  return codes;
}

export function filterOutDigits(text: string): string {
  return String.fromCharCode(...toCharcodes(text).filter((code) => !isDigit(code)));
}

export function extractNumbers(text: string): number[] {
  return (text.match(/\d+/g) || []).map(Number);
}

export function extractEndingNumber(text: string): number | undefined {
  const match = text.match(/\d+$/g);
  if (match) {
    assert(match.length == 1, `Expected only one match, but got ${match}`);
    return Number(match[0]);
  }
  return undefined;
}

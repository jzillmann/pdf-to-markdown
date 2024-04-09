import { groupByBlock, groupByLine } from '../support/groupingUtils';
import Item from '../Item';
import { Converter } from '../convert';
import { TextType, headlineLevel } from '../text-types';
import {
  TokenType,
  attachWithoutWhitespace,
  endSymbol,
  plainTextFormat,
  startSymbol,
  tokenToText,
} from '../token-types';

export default class MarkdownConverter implements Converter {
  convert(items: Item[]) {
    let content = '';

    groupByBlock(items).forEach((blockItems) => {
      const types = blockItems[0].data['types'] || [];
      let blockContent = '';
      groupByLine(blockItems).forEach((lineItems) => {
        blockContent += linesToText(lineItems);
        blockContent += '\n';
      });
      content += elementToText(blockContent, types[0]);
      content += '\n';
    });

    return content;
  }
}

function elementToText(text: string, type: TextType) {
  switch (type) {
    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
      return '#'.repeat(headlineLevel(type)) + ' ' + text + '\n';
    default:
      return text + '\n';
  }
}

function toWords(text: string): string[] {
  return text.split(' ').filter((string) => string.trim().length > 0);
}

export function linesToText(lineItems: Item[], disableInlineFormats: boolean = false) {
  let text = '';
  let openFormat: TokenType;

  const closeFormat = () => {
    text += endSymbol(openFormat);
    openFormat = null;
  };

  lineItems.forEach((lineItem, lineIndex) => {
    const words = toWords(lineItem.data['str']);
    words.forEach((word, i) => {
      const wordType = lineItem.tokenTypes[0]; // footnote, link, etc...
      const wordFormat = lineItem.tokenTypes[0]; // bold, oblique, etc...
      if (openFormat && (!wordFormat || wordFormat !== openFormat)) {
        closeFormat();
      }
      if (
        (i > 0 || lineIndex > 0) &&
        !(wordType && attachWithoutWhitespace(wordType)) &&
        !isPunctationCharacter(word)
      ) {
        text += ' ';
      }

      if (wordFormat && !openFormat && !disableInlineFormats) {
        openFormat = wordFormat;
        text += startSymbol(openFormat);
      }

      if (wordType && (!disableInlineFormats || plainTextFormat(wordType))) {
        text += tokenToText(word, wordFormat);
      } else {
        text += word;
      }
    });
    if (openFormat && (lineIndex == lineItems.length - 1 || firstFormat(lineItems[lineIndex + 1]) !== openFormat)) {
      closeFormat();
    }
  });
  return text;
}

function firstFormat(lineItem: Item) {
  if (lineItem.data['str'].length == 0) {
    return null;
  }
  return lineItem.tokenTypes[0];
}

function isPunctationCharacter(value: string) {
  if (value.length != 1) {
    return false;
  }
  return value[0] === '.' || value[0] === '!' || value[0] === '?';
}

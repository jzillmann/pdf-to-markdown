import CalculateGlobalStats from '../models/transformations/textitem/CalculateGlobalStats.jsx'

import CompactLines from '../models/transformations/lineitem/CompactLines.jsx'
import RemoveRepetitiveElements from '../models/transformations/lineitem/RemoveRepetitiveElements.jsx'
import VerticalToHorizontal from '../models/transformations/lineitem/VerticalToHorizontal.jsx'
import DetectTOC from '../models/transformations/lineitem/DetectTOC.jsx'
import DetectListItems from '../models/transformations/lineitem/DetectListItems.jsx'
import DetectHeaders from '../models/transformations/lineitem/DetectHeaders.jsx'

import GatherBlocks from '../models/transformations/textitemblock/GatherBlocks.jsx'
import DetectCodeQuoteBlocks from '../models/transformations/textitemblock/DetectCodeQuoteBlocks.jsx'
import DetectListLevels from '../models/transformations/textitemblock/DetectListLevels.jsx'
import ToTextBlocks from '../models/transformations/ToTextBlocks.jsx'
import ToMarkdown from '../models/transformations/ToMarkdown.jsx'

import ParseResult from '../models/ParseResult.jsx'

export const makeTransformations = fontMap => [
  new CalculateGlobalStats(fontMap),
  new CompactLines(),
  new RemoveRepetitiveElements(),
  new VerticalToHorizontal(),
  new DetectTOC(),
  new DetectHeaders(),
  new DetectListItems(),

  new GatherBlocks(),
  new DetectCodeQuoteBlocks(),
  new DetectListLevels(),

  new ToTextBlocks(),
  new ToMarkdown(),
]

export const transform = (pages, transformations) => {
  var parseResult = new ParseResult({ pages })
  let lastTransformation
  transformations.forEach(transformation => {
      if (lastTransformation) {
          parseResult = lastTransformation.completeTransform(parseResult)
      }
      parseResult = transformation.transform(parseResult)
      lastTransformation = transformation
  })
  return parseResult
}
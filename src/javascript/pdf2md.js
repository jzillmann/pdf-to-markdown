const { parse } = require('./lib/pdf.jsx')
const { makeTransformations, transform } = require('./lib/transformations.jsx')

/**
 * Reads a 
 * @param {string|TypedArray|DocumentInitParameters|PDFDataRangeTransport} pdfBuffer
 * Passed to `pdfjs.getDocument()` to read a PDF document for conversion
 * 
 * @param {Object} [callbacks]
 * Optional. A collection of callbacks to invoke when  
 * elements within the PDF document are parsed
 * @param {Function} [callbacks.metadataParsed]
 * @param {Function} [callbacks.pageParsed]
 * @param {Function} [callbacks.fontParsed]
 * @param {Function} [callbacks.documentParsed]
 * 
 * @returns {string} The Markdown text
 */
export default async function pdf2md (pdfBuffer, callbacks) {
  const result = await parse(pdfBuffer, callbacks)
  
  const { fonts, pages } = result
  const transformations = makeTransformations(fonts.map)
  const parseResult = transform(pages, transformations)
  const text = parseResult.pages
    .map(page => page.items.join('\n') + '\n')
    .join('')

  return text
}
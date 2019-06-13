import pdfjs from 'pdfjs-dist'

import TextItem from '../models/TextItem.jsx'
import Page from '../models/Page.jsx'

const NO_OP = () => {}

export async function parse(docOptions, callbacks) {
  const { metadataParsed, pageParsed, fontParsed, documentParsed } = {
    metadataParsed: NO_OP,
    pageParsed: NO_OP,
    fontParsed: NO_OP,
    documentParsed: NO_OP,
    ...(callbacks || {}),
  }
  const pdfDocument = await pdfjs.getDocument(docOptions)
  const metadata = await pdfDocument.getMetadata()
  metadataParsed(metadata)

  const pages = [...Array(pdfDocument.numPages).keys()].map(
    index => new Page({ index })
  )

  documentParsed(pdfDocument, pages)

  const fonts = {
    ids: new Set(),
    map: new Map(),
  }

  for (let j = 1; j <= pdfDocument.numPages; j++) {
    const page = await pdfDocument.getPage(j)
    const scale = 1.0
    const viewport = page.getViewport(scale)
    const textContent = await page.getTextContent()
    const textItems = textContent.items.map(item => {
      const fontId = item.fontName

      if (!fonts.ids.has(fontId) && fontId.startsWith('g_d0')) {
        pdfDocument.transport.commonObjs.get(fontId, font => {
          if (!fonts.ids.has(fontId)) {
            fonts.ids.add(fontId)
            fonts.map.set(fontId, font)
            fontParsed(fonts)
          }
        })
      }

      const tx = pdfjs.Util.transform(
        viewport.transform,
        item.transform
      )

      const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
      const dividedHeight = item.height / fontHeight;
      return new TextItem({
          x: Math.round(item.transform[4]),
          y: Math.round(item.transform[5]),
          width: Math.round(item.width),
          height: Math.round(dividedHeight <= 1 ? item.height : dividedHeight),
          text: item.str,
          font: fontId,
      })
    })
    pages[page.pageIndex].items = textItems
    pageParsed(pages)

    // Trigger the font retrieval for the page
    page.getOperatorList()
  }
  return {
    fonts,
    metadata,
    pages,
    pdfDocument,
  }
}
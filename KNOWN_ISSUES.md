# Known Issues

## Missing or wrong characters

The text which comes of pdfjs looks very erronous sometimes. E.g [Life-Of-God-In-Soul-Of-Man](examples/Life-Of-God-In-Soul-Of-Man.pdf).
The interesting thing is that rendering with pdfjs (online) looks good. So maybe this is just a setup problem !?

## Uncovered TOC variants

- out of order items [Safe-Communication](examples/Safe-Communication.pdf)
- items in wrong lines + numbers are not numbers [Life-Of-God-In-Soul-Of-Man](examples/Life-Of-God-In-Soul-Of-Man.pdf)
- CC-NC_Leitfaden.pdf: un-verified toc entries (and/und/&... etc...)
- Closed-Syllables.pdf: unverified toc entries

## Not yet reviewed test PDFS

- Achieving-The-Paris-Climate-Agreement.pdf
  - wrong page page mapping ?
  - no page numbers removed
  - no toc
- Made-with-cc.pdf
  - no toc
- Watered-Soul-Blog-Book.pdf
  - TOC: character minumum cuts out year
  - TOC: stops to early

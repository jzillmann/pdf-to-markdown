# Known Issues

## Missing or wrong characters

The text which comes of pdfjs looks very erronous sometimes. E.g [Life-Of-God-In-Soul-Of-Man](examples/Life-Of-God-In-Soul-Of-Man.pdf).
The interesting thing is that rendering with pdfjs (online) looks good. So maybe this is just a setup problem !?

## Uncovered TOC variants

- out of order items [Safe-Communication](examples/Safe-Communication.pdf)
- items in wrong lines + numbers are not numbers [Life-Of-God-In-Soul-Of-Man](examples/Life-Of-God-In-Soul-Of-Man.pdf)
- CC-NC_Leitfaden.pdf: un-verified toc entries (and/und/&... etc...)
- Closed-Syllables.pdf: unverified toc entries
- Safe-Communication.pdf: One toc element is one page off (8=>9)
- no page numbers [The-Art-of-Public-Speaking](examples/The-Art-of-Public-Speaking.pdf).
- multiline headlines: [WoodUp](examples/WoodUp.pdf)
- Detecting list of figures (and creating headlines) [Achieving-The-Paris-Climate-Agreement](Achieving-The-Paris-Climate-Agreement.pdf)

## Not yet reviewed test PDFS

# Achieving-The-Paris-Climate-Agreement.pdf

- wrong page page mapping ?
- no page numbers removed
- no toc
- romisch numbers are wrong
- subheading under the toc headings should be detected as well (clearly not in the code)

# Sherlock

- words not together

# Made-with-cc.pdf

- no toc

# Watered-Soul-Blog-Book.pdf

- TOC: character minumum cuts out year
- TOC: stops to early

# Life of God in Soul of man

- Headlines confusion (after the headline the first words of a sentence are big... shouldn't be a headline in this case... looks at all heights in the line)

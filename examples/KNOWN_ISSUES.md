# Known Issues

## Missing or wrong characters

The text which comes of pdfjs looks very erronous sometimes. E.g [Life-Of-God-In-Soul-Of-Man](examples/Life-Of-God-In-Soul-Of-Man.pdf).
The interesting thing is that rendering with pdfjs (online) looks good (but copying the text shows the same distortion). So maybe this is just a setup problem !?

## Uncovered TOC variants

- out of order items [Safe-Communication](examples/Safe-Communication.pdf)
- items in wrong lines + numbers are not numbers [Life-Of-God-In-Soul-Of-Man](examples/Life-Of-God-In-Soul-Of-Man.pdf)
- no page numbers [The-Art-of-Public-Speaking](examples/The-Art-of-Public-Speaking.pdf).
- multiline headlines: [WoodUp](examples/WoodUp.pdf)
- Detecting list of figures (and creating headlines) [Achieving-The-Paris-Climate-Agreement](Achieving-The-Paris-Climate-Agreement.pdf)

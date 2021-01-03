# PDF-To-Markdown Converter Core

Javascript library to parse PDF files and convert them into Markdown format. Ui version online version at http://pdf2md.morethan.io!

## Use

//TBD

## Contribute

Use the [issue tracker](https://github.com/jzillmann/pdf-to-markdown/issues) and/or open [pull requests](https://github.com/jzillmann/pdf-to-markdown/pulls)!

## Build

- `npm install` Download all necessary npm packages
- `npm test` Run the tests
- `npm run lint` Lint the javascript files
- `npm run format` Run the prettier formatter
- `npm run build` Compile the typescript files to the `lib` folder

### Test Release locally and use in other projects

- `npm link` in the core project
- `npm link pdf-to-markdown-core` in the target project

## Release

//TBD

## Credits

[pdf.js](https://mozilla.github.io/pdf.js/) - Mozilla's PDF parsing & rendering platform which is used as a raw parser

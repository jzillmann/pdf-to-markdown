# PDF-To-Markdown Converter

Javascript tool to parse PDF files and convert them into Markdown format. Online version at http://pdf2md.morethan.io!

## Major Changes

- **2020/2021** Currently separating the parsing logic from the frontent in order to make it separately available. 
  - [Branch modularize](https://github.com/jzillmann/pdf-to-markdown/tree/modularize) 
  - Find the current version at https://jzillmann.github.io/pdf-to-markdown-staging/
  - [Help me](https://github.com/jzillmann/pdf-to-markdown/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+milestone%3Av2) 
- **Apr 2017** - 0.1: Initial Release

## Contribute

Use the [issue tracker](https://github.com/jzillmann/pdf-to-markdown/issues) and/or open [pull requests](https://github.com/jzillmann/pdf-to-markdown/pulls)!

#### Useful Build Commands

- ```npm install``` Download all necessary npm packages
- ```npm run lint``` Lint the javascript files
- ```npm run test``` Run tests
- ```npm run check``` Lint & Test
- ```npm run build``` Build the dev version
- ```npm run start``` Run the app on an server (useful for loading of worker.js and cmaps)
- ```npm run watch``` Continuously build the project
- ```open build/index.html``` Open the build project in your default browser
- ```npm run release``` Build production version
- ```npm run deploy``` Build production version & move it to the github pages fodler

#### Release
- Increase version in package.json
- ```npm run deploy```
- commit & push
- tag with
  - _git tag -a $releaseVersion -m "$releaseVersion release"_
  - _git push --tags_


## Credits

[pdf.js](https://mozilla.github.io/pdf.js/) - Mozilla's PDF parsing & rendering platform which is used as a raw parser

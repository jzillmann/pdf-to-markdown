# PDF-To-Markdown Converter

Javascript tool to parse PDF files and convert them into Markdwon format. Online version at http://pdf2md.morethan.io!

## Major Changes

- **Apr 2017** - 0.1: Initial Release

## Contribute

Use the [issue tracker](https://github.com/jzillmann/pdf-to-markdown/issues) and/or open [pull requests](https://github.com/jzillmann/pdf-to-markdown/pulls)!

#### Useful Build Commands

- ```npm install``` Download all necessary npm packages
- ```npm run lint``` Lint the javascript files
- ```npm run test``` Run tests
- ```npm run check``` Lint & Test
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
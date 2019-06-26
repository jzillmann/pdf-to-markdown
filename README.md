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
- ```npm run build``` Build the dev version
- ```npm run start``` Run the app on an server (useful for loading of worker.js and cmaps)
- ```npm run watch``` Continuously build the project
- ```open build/index.html``` Open the build project in your default browser
- ```npm run release``` Build production version
- ```npm run deploy``` Build production version & move it to the github pages foldler
- ```npm run prepare``` Babelify necessary files and package into the `dist/` directory

#### CLI tool
Instructions to run:
<pre>
$ cd [project_folder]
$ npm run prepare
$ node dist/pdf2md-cli.js --inputFolderPath=[your input folder path] --outputFolderPath=[your output folder path] --recursive=[true or false]
</pre>
If you are converting recursively on a large number of files you might encounter the error "Allocation failed - JavaScript heap out of memory”. Instead, run the command
<pre>
$ node --max-old-space-size=4096 index.js --inputFolderPath=[your input folder path] --outputFolderPath=[your output folder path] --recursive=[1 or 0]
</pre>

Options:
1. Input folder path (should exist)
2. Output folder path (should exist)
3. Recursive - convert all PDFs for folders within folders

#### Release
- Increase version in package.json
- ```npm run deploy```
- commit & push
- tag with
  - _git tag -a $releaseVersion -m "$releaseVersion release"_
  - _git push --tags_


## Credits

[pdf.js](https://mozilla.github.io/pdf.js/) - Mozilla's PDF parsing & rendering platform which is used as a raw parser
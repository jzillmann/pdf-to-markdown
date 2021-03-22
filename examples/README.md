# Test PDFs

This folder contains PDFs for testing purposes and the parse results of the PDFs. Generally there are 3 types of PDFs test setups:

1. Self generated PDFs
2. PDFs which entered `public domain` or have a otherwise permissive license like `Creative Commons SA`
3. PDFs where the license is unclear

For (1) and (2) we track the end-result and all transformation steps.
For (3) we only track the resulst of some transfomation stages (those who doesn't leak too much of the content)

## Self-generated PDFs

- [ExamplePdf](ExamplePdf.pdf)

## Included Public PDFs

_(PDFs which entered `public domain` or have a otherwise permissive license like `Creative Commons SA`)_

| File                                                               | Source                                | Author                                           | License Information       |
| ------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------ | ------------------------- |
| [Adventures-Of-Sherlock-Holmes](Adventures-Of-Sherlock-Holmes.pdf) | https://pdfreebooks.org/              | Arthur Doyle                                     | Public Domain             |
| [Alice-In-Wonderland](Alice-In-Wonderland.pdf)                     | https://pdfreebooks.org/              | Lewis Carroll                                    | Public Domain             |
| [Closed-Syllables](Closed-Syllables.pdf)                           | ?                                     | Susan Jones                                      | Creative Commons BY 4.0   |
| [Flash-Masques-Temperature](Flash-Masques-Temperature.pdf)         | https://www.techtera.org/             | ?                                                | Creative Commons BY 4.0   |
| [Grammar-Matters](Grammar-Matters.pdf)                             | ?                                     | Debbie Kuhlmann                                  | Creative Commons BY 4.0   |
| [Life-Of-God-In-Soul-Of-Man](lLife-Of-God-In-Soul-Of-Man.pdf)      | https://archive.org/                  | Henry Scougal                                    | Public Domain             |
| [Safe-Communication](Safe-Communication.pdf)                       | https://www.england.nhs.uk/           | Nicola Davey & Ali Cole                          | Creative Commons BY 4.0   |
| [St-Mary-Witney-Social-Audit](St-Mary-Witney-Social-Audit.pdf)     | https://catrionarobertson.com/        | Catriona Robertson                               | Creative Commons BY 4.0   |
| [The-Art-of-Public-Speaking](The-Art-of-Public-Speaking.pdf)       | http://www.gutenberg.org/ebooks/16317 | Dale Carnagey, J. Berg Esenwein                  | Project Gutenberg License |
| [The-Man-Without-A-Body](The-Man-Without-A-Body)                   | ?                                     | Edward Page Mitchell                             | Public Domain             |
| [The-War-of-the-Worlds](The-War-of-the-Worlds.pdf)                 | http://www.planetpdf.com/             | H.G Wells                                        | Public Domain             |
| [Tragedy-Of-The-Commons](Tragedy-Of-The-Commons.pdf)               | https://science.sciencemag.org        | Garrett Hardin                                   | Public Domain             |
| [WoodUp](WoodUp.pdf)                                               | https://bupress.unibz.it/             | Freie Universität Bozen-Bolzano / Giustino Tonon | Creative Commons BY 4.0   |

## PDFs not stored but paritally tested

- https://homepages.cwi.nl/~lex/files/dict.pdf

# Known transformatino problems

_Tracks known problems with parsing and transforming certain PDFs ._

- `Remove Repetitive Elements`
  - https://homepages.cwi.nl/~lex/files/dict.pdf
    - Nothing gets detected cause the page-number line contains the current chapter

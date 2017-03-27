import { Enum } from 'enumify';

// An Markdown word element
export default class WordType extends Enum {
}

WordType.initEnum(['LINK', 'FOOTNOTE_LINK', 'FOOTNOTE', 'BOLD', 'OBLIQUE', 'BOLD_OBLIQUE']);
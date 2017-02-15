import ToPdfViewTransformation from './ToPdfViewTransformation.jsx';
import ParseResult from '../ParseResult.jsx';

export default class NoOp extends ToPdfViewTransformation {

    constructor() {
        super("Original");
    }

    transform(parseResult:ParseResult) {
        return parseResult;
    }

}
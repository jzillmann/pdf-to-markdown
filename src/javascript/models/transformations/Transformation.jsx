import AppState from '../PdfPage.jsx';

// A transformation from an PdfPage to an PdfPage
export default class Transformation {

    constructor(name) {
        if (this.constructor === Transformation) {
            throw new TypeError("Can not construct abstract class.");
        }
        if (this.transform === Transformation.prototype.transform) {
            throw new TypeError("Please implement abstract method 'transform()'.");
        }
        this.name = name;
    }

    transform(pdfPage:PdfPage) {
        throw new TypeError("Do not call abstract method foo from child.");
    }
}
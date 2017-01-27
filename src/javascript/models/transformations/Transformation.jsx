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

    showPageSelection() {
        return true;
    }

    // Returns with which type the transformed pages can be viewed
    contentView() {
        throw new TypeError("Do not call abstract method foo from child.");
    }

    // Transform incoming pages (like PdfPage[]) into different pages (either PdfPages[] or TextPages[])
    transform(pages) { // eslint-disable-line no-unused-vars
        throw new TypeError("Do not call abstract method foo from child.");
    }

    // Annotations which have been added during transform() can now be cleaned-up / handled
    processAnnotations(pages) { // eslint-disable-line no-unused-vars
        return pages;
    }


}
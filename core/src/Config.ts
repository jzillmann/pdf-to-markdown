import ItemTransformer from './transformer/ItemTransformer';

export default interface Config {
  // See DocumentInitParameters from https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html#DocumentInitParameters
  pdfjsParams?: object;
  transformers?: ItemTransformer[];
  // TODO keep pdfPages ?
}

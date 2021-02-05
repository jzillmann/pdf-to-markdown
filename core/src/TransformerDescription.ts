export default interface TransformerDescription {
  readonly consumesGlobels?: string[];
  readonly producesGlobels?: string[];
  readonly consumes?: string[];
  readonly produces?: string[];
  readonly removes?: string[];
}

export default interface TransformerDescriptor {
  readonly requireColumns?: string[];
  readonly consumesGlobels?: string[];
  readonly producesGlobels?: string[];
}

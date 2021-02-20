import PageViewport from '../parse/PageViewport';

export default interface TransformContext {
  fontMap: Map<string, object>;
  pageViewports: PageViewport[];
}

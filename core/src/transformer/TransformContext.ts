import Item from '../Item';
import PageViewport from '../parse/PageViewport';
import EvaluationTracker from './EvaluationTracker';

export default class TransformContext {
  pageCount: number;

  constructor(
    public fontMap: Map<string, object>,
    public pageViewports: PageViewport[],
    private evaluations = new EvaluationTracker(),
  ) {
    this.pageCount = pageViewports.length;
  }

  trackEvaluation(item: Item) {
    this.evaluations.trackEvaluation(item);
  }
}

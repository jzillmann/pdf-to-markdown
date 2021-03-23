import Item from '../Item';
import PageViewport from '../parse/PageViewport';
import EvaluationTracker from './EvaluationTracker';

export default class TransformContext {
  constructor(
    public fontMap: Map<string, object>,
    public pageViewports: PageViewport[],
    private evaluations = new EvaluationTracker(),
  ) {}

  trackEvaluation(item: Item) {
    this.evaluations.trackEvaluation(item);
  }
}

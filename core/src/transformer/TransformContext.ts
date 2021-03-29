import Item from '../Item';
import PageViewport from '../parse/PageViewport';
import EvaluationTracker from './EvaluationTracker';
import GlobalDefinition from '../GlobalDefinition';
import Globals from '../Globals';

export default class TransformContext {
  pageCount: number;

  constructor(
    public fontMap: Map<string, object>,
    public pageViewports: PageViewport[],
    private globals: Globals,
    private evaluations = new EvaluationTracker(),
  ) {
    this.pageCount = pageViewports.length;
  }

  trackEvaluation(item: Item) {
    this.evaluations.trackEvaluation(item);
  }

  globalIsDefined<T>(definition: GlobalDefinition<T>): boolean {
    return this.globals.isDefined(definition);
  }

  getGlobal<T>(definition: GlobalDefinition<T>): T {
    return this.globals.get(definition);
  }
}

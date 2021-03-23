import { assertDefined } from '../assert';
import Item from '../Item';
import EvaluationIndex from './EvaluationIndex';

export default class EvaluationTracker implements EvaluationIndex {
  private evaluations: Set<string> = new Set();

  evaluationCount() {
    return this.evaluations.size;
  }

  evaluated(item: Item) {
    return this.evaluations.has(_uuid(item));
  }

  trackEvaluation(item: Item) {
    this.evaluations.add(_uuid(item));
  }
}

function _uuid(item: Item): string {
  return assertDefined(item.uuid, 'UUID is not set');
}

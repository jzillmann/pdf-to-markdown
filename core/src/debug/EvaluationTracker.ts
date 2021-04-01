import { assertDefined } from '../assert';
import Item from '../Item';
import EvaluationIndex from './EvaluationIndex';

export default class EvaluationTracker implements EvaluationIndex {
  private evaluations: Map<string, any> = new Map();
  private scored = false;

  evaluationCount() {
    return this.evaluations.size;
  }

  hasScores(): boolean {
    return this.scored;
  }

  evaluated(item: Item): boolean {
    return this.evaluations.has(_uuid(item));
  }

  evaluationScore(item: Item) {
    return this.evaluations.get(_uuid(item));
  }

  trackEvaluation(item: Item, score: any = undefined) {
    if (typeof score !== 'undefined') {
      this.scored = true;
    }
    this.evaluations.set(_uuid(item), score);
  }
}

function _uuid(item: Item): string {
  return assertDefined(item.uuid, 'UUID is not set');
}

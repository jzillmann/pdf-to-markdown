import Item from '../Item';

export default interface EvaluationIndex {
  /**
   * Return the number of tracked evaluations.
   */
  evaluationCount(): number;

  /**
   * Returns the true if the given item has been evaluated
   * @param item
   */
  evaluated(item: Item): boolean;
}

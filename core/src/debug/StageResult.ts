import Item from '../Item';
import AnnotatedColumn from './AnnotatedColumn';

export default interface StageResult {
  schema: AnnotatedColumn[];
  items: Item[];
  messages: string[];
}

import TransformDescriptor from '../TransformDescriptor';
import Item from '../Item';
import AnnotatedColumn from './AnnotatedColumn';
import { Change } from './detectChanges';

export default interface StageResult {
  descriptor?: TransformDescriptor;
  schema: AnnotatedColumn[];
  items: Item[];
  changes: Map<string, Change>;
  messages: string[];
}

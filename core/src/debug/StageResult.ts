import TransformDescriptor from '../TransformDescriptor';
import Item from '../Item';
import AnnotatedColumn from './AnnotatedColumn';

export default interface StageResult {
  descriptor?: TransformDescriptor;
  schema: AnnotatedColumn[];
  items: Item[];
  messages: string[];
}

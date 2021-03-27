import type Item from './Item';
import GlobalValue from './transformer/GlobalValue';

export default interface ItemResult {
  items: Item[];
  messages: string[];
  globals?: GlobalValue<any>[];
}

import type ItemGroup from './ItemGroup';

export default interface Page {
  index: number;
  itemGroups: ItemGroup[];
}

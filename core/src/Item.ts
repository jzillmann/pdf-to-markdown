import { v4 as uuidv4 } from 'uuid';

export default class Item {
  page: number;
  data: object;
  uuid?: string;

  constructor(page: number, data: object, uuid: string = uuidv4()) {
    this.page = page;
    this.data = data;
    this.uuid = uuid;
  }

  value(column: string): object {
    return this.data[column];
  }

  withDataAddition(data: object): Item {
    return this.withData({ ...this.data, ...data });
  }

  withData(data: object): Item {
    return new Item(this.page, data, this.uuid);
  }

  /**
   * Returns the item without a uuid.
   */
  withoutUuid(): Item {
    return new Item(this.page, this.data, '');
  }
}

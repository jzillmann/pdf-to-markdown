export default class Item {
  page: number;
  data: object;

  constructor(page: number, data: object) {
    this.page = page;
    this.data = data;
  }

  value(column: string): object {
    return this.data[column];
  }
}

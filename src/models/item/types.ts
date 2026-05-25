export interface Item {
  id: string | number,
  parent: Item['id'] | null,
  label: string,
};

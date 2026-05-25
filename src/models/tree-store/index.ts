import type { Item } from '../item/types';
import { useCache } from '@/utils/useCache';

export class TreeStore {
  #items: Item[] = [];
  #cachedItemsById = new Map();
  #cachedItemsByParent = new Map();

  constructor(items: Item[]) {
    this.#items = [...items];
    this.#cachedItemsById = useCache(this.#items, 'id');
    this.#cachedItemsByParent = useCache(this.#items, 'parent', { multiple: true });
  }

  getAll() {
    return this.#items;
  }

  getItem(id: Item['id']) {
    return this.#cachedItemsById.get(id);
  }

  getChildren(id: Item['id']) {
    const item = this.#cachedItemsById.get(id);

    if (!item) return [];

    return this.#cachedItemsByParent.get(item.id) ?? [];
  }

  getAllChildren(id: Item['id']) {
    const allChildren: Item[] = [];
    const cachedItemsByParent = this.#cachedItemsByParent;
    const recursiveSearch = function(items: Item[]) {
      for (const item of items) {
        const children = cachedItemsByParent.get(item.id);

        allChildren.push(item);

        if (children) {
          recursiveSearch(children);
        }
      }
    }

    const headChildren = cachedItemsByParent.get(id);

    if (headChildren?.length) {
      recursiveSearch(headChildren);
    }

    return allChildren;
  }

  getAllParents(id: Item['id']) {
    const allParents = [];
    const cachedItemsById = this.#cachedItemsById;
    const targetItem = cachedItemsById.get(id);
    const recursiveParentFinder = function(item: Item) {
      if (item.parent === null) return;

      const parentItem = cachedItemsById.get(item.parent);

      if (parentItem) {
        allParents.push(parentItem);
        recursiveParentFinder(parentItem);
      }
    }

    if (targetItem) {
      allParents.push(targetItem);
      recursiveParentFinder(targetItem);
    }

    return allParents;
  }

  addItem(item: Item) {
    this.#items.push(item);
    this.#cachedItemsById.set(item.id, item);

    if (item.parent === null) return;

    if (this.#cachedItemsByParent.has(item.parent)) {
      this.#cachedItemsByParent.get(item.parent).push(item);
    } else {
      this.#cachedItemsByParent.set(item.parent, [item]);
    }
  }

  removeItem(id: Item['id']) {
    const itemIndex = this.#items.findIndex((item) => item.id === id);
    const cachedItem = this.#cachedItemsById.get(id);

    if (!cachedItem || itemIndex === -1) {
      return;
    }

    this.#items.splice(itemIndex, 1);
    this.#cachedItemsById.delete(id);

    if (this.#cachedItemsByParent.has(cachedItem.parent)) {
      const targetItemIndex = this.#cachedItemsByParent
        .get(cachedItem.parent)
        .findIndex((targetItem: Item) => targetItem.id === id)

      if (targetItemIndex !== -1) {
        this.#cachedItemsByParent.get(cachedItem.parent).splice(targetItemIndex, 1);
      }
    }
  }

  updateItem(item: Item) {
    const cachedItem = this.#cachedItemsById.get(item.id);

    if (!cachedItem) {
      throw new Error(`Айтема с id = ${item.id} - несуществует!`);
    }

    this.removeItem(cachedItem.id);
    this.addItem(item);
  }
};

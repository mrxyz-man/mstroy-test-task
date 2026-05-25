class TreeStore {
  constructor(items) {
    this.items = items;

    this.cachedItemsById = this.items.reduce((acc, item) => {
      acc.set(item.id, item);
      return acc;
    }, new Map());

    this.cachedItemsByParent = this.items.reduce((acc, item) => {
      if (!item.parent) return acc;

      if (acc.has(item.parent)) {
        acc.get(item.parent).push(item);
        return acc;
      }

      acc.set(item.parent, [item]);

      return acc;
    }, new Map());
  }

  getAll() {
    return this.items;
  }

  getItem(id) {
    return this.cachedItemsById.get(id);
  }

  getChildren(id) {
    if (!['string', 'number'].includes(typeof id)) return [];

    const item = this.cachedItemsById.get(id);

    if (!item) return [];

    return this.cachedItemsByParent.get(item.id);
  }

  getAllChildren(id) {
    if (!['string', 'number'].includes(typeof id)) return [];
    const { cachedItemsByParent } = this;

    const allChildren = [];
    const recursiveSearch = function(items) {
        for (let i = 0; i < items.length; i++) {
           const item = items[i];
           const children = cachedItemsByParent.get(item.id);

           allChildren.push(item);

           if (!!children) {
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

  getAllParents(id) {
    const { cachedItemsById } = this;
    const allParents = [];
    const targetItem = cachedItemsById.get(id);
    const recursiveParentFinder = function(item) {
        if ([null, undefined].includes(item.parent)) return;

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

  addItem(item) {
    if (typeof item !== 'object') {
      throw new Error('Айтем должен быть обьектом!');
    }

    if (!('id' in item)) {
      throw new Error('Айтем должен содержать поле "id"!');
    }

    if (!['string', 'number'].includes(typeof item.id)) {
      throw new Error('Поле "id" не соответствует нужному типу данных!');
    }

    if (this.cachedItemsById.has(item.id)) {
      throw new Error(`Айтем с id = ${item.id} - уже существует!`);
    }

    this.items.push(item);
    this.cachedItemsById.set(item.id, item);

    if (this.cachedItemsByParent.has(item.parent)) {
      this.cachedItemsByParent.get(item.parent).push(item);
    } else {
      this.cachedItemsByParent.set(item.parent, [item]);
    }
  }
}

const tree = new TreeStore([
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]);

tree.addItem({ id: 9, parent: 4, label: 'Айтем 9' });

console.log(tree.getAllChildren(4));

type UseCacheOptions = {
  multiple?: boolean;
};

export function useCache<TItem extends object, TField extends keyof TItem> (
  items: TItem[],
  field: TField,
  opts?: UseCacheOptions
) {
  const options: UseCacheOptions = {
    multiple: false,
    ...opts,
  };
  const result = new Map<TItem[TField], TItem | TItem[]>();

  if (!Array.isArray(items)) {
    return result;
  }

  for (const item of items) {
    const cacheIndex = item[field];

    if (options.multiple) {
      const cacheVal = result.get(cacheIndex);

      if (Array.isArray(cacheVal)) {
        cacheVal.push(item);
      } else {
        result.set(cacheIndex, [item]);
      }
    } else {
      if (!result.has(cacheIndex)) {
        result.set(cacheIndex, item);
      }
    }
  }

  return result;
};

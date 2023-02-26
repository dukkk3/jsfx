export type CachedItem<T, K> = { key: K; item: T };
export type CacheStore<T, K> = (
	currentKey: K,
	findItemByKey: (key: K) => boolean,
	createItem: () => T,
	updateItem?: (item: T) => T | null
) => T;

export const createCacheStore = <T, K>(): CacheStore<T, K> => {
	const items: CachedItem<T, K>[] = [];
	return (currentKey, findItemByKey, createItem, updateItem) => {
		const itemIndex = items.findIndex((item) => findItemByKey(item.key));
		if (itemIndex < 0) {
			const createdItem = createItem();
			items.push({ key: currentKey, item: createdItem });
			return createdItem;
		}
		if (updateItem) {
			const updatedItem = updateItem(items[itemIndex].item);
			if (updatedItem) {
				items[itemIndex].item = updatedItem;
				return updatedItem;
			}
		}
		return items[itemIndex].item;
	};
};

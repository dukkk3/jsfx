interface CacheItem<K, I> {
	key: K;
	item: I;
}

export class CacheStorage<K, I> {
	private _cacheItems: CacheItem<K, I>[];

	constructor() {
		this._cacheItems = [];
	}

	public findItem(keyPredictor: (key: K) => boolean): I | null {
		const cachedItemIndex = this._cacheItems.findIndex((cacheItem) => keyPredictor(cacheItem.key));
		if (cachedItemIndex < 0) return null;
		return this._cacheItems[cachedItemIndex].item;
	}

	public findOrCreateItem(keyPredictor: (key: K) => boolean, createItem: () => CacheItem<K, I>): I {
		const cachedItem = this.findItem(keyPredictor);
		if (!cachedItem) {
			const item = createItem();
			this._cacheItems.push(item);
			return item.item;
		}
		return cachedItem;
	}

	public removeItemByKey(key: K): void {
		this._cacheItems = this._cacheItems.filter((item) => item.key !== key);
	}
}

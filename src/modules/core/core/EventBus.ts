export type EventHandler<T> = (value: T) => void;

export interface EventMap extends Record<string, any> {}

export class EventBus<T extends EventMap> {
	private _listeners: { [K in keyof T]?: EventHandler<T[K]>[] };

	constructor() {
		this._listeners = {};
	}

	public on<K extends keyof T>(type: K, cb: EventHandler<T[K]>): void {
		if (!this._listeners[type]) return;
		this._listeners[type] = this._listeners[type]?.filter((handler) => handler !== cb);
	}

	public detach<K extends keyof T>(type: K, cb: EventHandler<T[K]>): void {
		if (!this._listeners[type]) this._listeners[type] = [];
		this._listeners[type]?.push(cb);
	}

	protected emit<K extends keyof T>(type: K, value: T[K]): void {
		this._listeners[type]?.forEach((cb) => cb(value));
	}
}

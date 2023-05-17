import { EventBus, EventMap } from "./EventBus";

export class EventBusWithChangedState<T extends EventMap> extends EventBus<T> {
	private _haveSomeChanges: boolean;

	public get haveSomeChanges(): boolean {
		return this._haveSomeChanges;
	}

	constructor() {
		super();
		this._haveSomeChanges = false;
	}

	public resetChangesFlag(): void {
		this._haveSomeChanges = false;
	}

	protected emit<K extends keyof T>(type: K, value: T[K]): void {
		super.emit(type, value);
		this._haveSomeChanges = true;
	}
}

import { v4 as uuid4 } from "uuid";

export abstract class AbstractObject<V = any, M = any> {
	public id: string;
	public zIndex: number;
	public hidden: boolean;
	public abstract scale: V;
	public abstract position: V;
	public abstract translation: V;
	public abstract transformMatrix: M;

	constructor() {
		this.id = uuid4();
		this.zIndex = 0;
		this.hidden = false;
	}

	protected abstract updateTransformMatrix(): void;
}

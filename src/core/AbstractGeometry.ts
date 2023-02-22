import { Attribute } from "@core/shared/Attribute";

export type Attributes = Record<string, Attribute>;

export abstract class AbstractGeometry<T extends Attributes = any> {
	constructor(public positionAttribute: Attribute, public attributes?: T) {}

	public setAttributeByName<K extends keyof T>(name: K, value: T[K]): void {
		if (this.attributes && name in this.attributes) this.attributes[name] = value;
	}
}

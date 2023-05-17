import { BufferGeometry } from "@geometries/BufferGeometry";
import { AbstractAttribute } from "./AbstractAttribute";

export interface GeometryAttributes {
	normal: AbstractAttribute;
	textureCoord: AbstractAttribute;
}

export interface LoadedObject {
	geometries: {
		geometry: BufferGeometry<GeometryAttributes>;
		data: (GeometryAttributes & { position: AbstractAttribute })[];
	}[];
}

export abstract class AbstractLoader {
	public async load(source: string): Promise<LoadedObject> {
		const response = await fetch(source);
		const text = await response.text();
		return this.parse(text);
	}

	protected abstract parse(source: string): LoadedObject;
}

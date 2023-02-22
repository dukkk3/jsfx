import { vec2 } from "gl-matrix";
import type { LikeVector2, Vector2Array } from "../types";

export class Vector2 {
	public static getArrayFromVectorOrNumber(vectorOrNumber: LikeVector2 | number): Vector2Array {
		if (Array.isArray(vectorOrNumber)) return vectorOrNumber;
		if (typeof vectorOrNumber === "number") return [vectorOrNumber, vectorOrNumber];
		return vectorOrNumber.toArray();
	}

	public static getVectorFromVectorOrNumber(vectorOrNumber: LikeVector2 | number): Vector2 {
		if (vectorOrNumber instanceof Vector2) {
			return new Vector2(vectorOrNumber);
		}

		return new Vector2(this.getArrayFromVectorOrNumber(vectorOrNumber));
	}

	private _vector: Vector2Array;

	public get length(): number {
		return vec2.length(this._vector);
	}

	public get squaredLength(): number {
		return vec2.squaredLength(this._vector);
	}

	public get x(): number {
		return this._vector[0];
	}

	public get y(): number {
		return this._vector[1];
	}

	public set x(value: number) {
		this._vector[0] = value;
	}

	public set y(value: number) {
		this._vector[1] = value;
	}

	constructor(vector: LikeVector2 | number = 0) {
		this._vector = Vector2.getArrayFromVectorOrNumber(vector);
	}

	public toArray(): Vector2Array {
		return [...this._vector];
	}

	public add(vectorOrNumber: LikeVector2 | number): void {
		vec2.add(this._vector, this._vector, Vector2.getArrayFromVectorOrNumber(vectorOrNumber));
	}

	public sub(vectorOrNumber: LikeVector2 | number): void {
		vec2.sub(this._vector, this._vector, Vector2.getArrayFromVectorOrNumber(vectorOrNumber));
	}

	public multiply(vectorOrFactor: LikeVector2 | number): void {
		vec2.multiply(this._vector, this._vector, Vector2.getArrayFromVectorOrNumber(vectorOrFactor));
	}

	public divide(vectorOrFactor: LikeVector2 | number): void {
		vec2.divide(this._vector, this._vector, Vector2.getArrayFromVectorOrNumber(vectorOrFactor));
	}

	public scale(factor: number): void {
		vec2.scale(this._vector, this._vector, factor);
	}

	public getDistance(vector: LikeVector2): number {
		return vec2.distance(this._vector, Vector2.getArrayFromVectorOrNumber(vector));
	}

	public getSquaredDistance(vector: LikeVector2): number {
		return vec2.squaredDistance(this._vector, Vector2.getArrayFromVectorOrNumber(vector));
	}

	public copy(vector: LikeVector2): void {
		const isArray = Array.isArray(vector);
		this.x = isArray ? vector[0] : vector.x;
		this.y = isArray ? vector[1] : vector.y;
	}
}

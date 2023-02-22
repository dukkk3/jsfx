import { vec3 } from "gl-matrix";
import type { LikeVector3 } from "../types";

export class Vector3 {
	public static getArrayFromVectorOrNumber(
		vectorOrNumber: LikeVector3 | number
	): [x: number, y: number, z: number] {
		if (Array.isArray(vectorOrNumber)) return vectorOrNumber;
		if (typeof vectorOrNumber === "number") return [vectorOrNumber, vectorOrNumber, vectorOrNumber];
		return vectorOrNumber.toArray();
	}

	private _vector: [x: number, y: number, z: number];

	public get length(): number {
		return vec3.length(this._vector);
	}

	public get squaredLength(): number {
		return vec3.squaredLength(this._vector);
	}

	public get x(): number {
		return this._vector[0];
	}

	public get y(): number {
		return this._vector[1];
	}

	public get z(): number {
		return this._vector[2];
	}

	public set x(value: number) {
		this._vector[0] = value;
	}

	public set y(value: number) {
		this._vector[1] = value;
	}

	public set z(value: number) {
		this._vector[2] = value;
	}

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this._vector = [x, y, z];
	}

	public toArray(): [x: number, y: number, z: number] {
		return this._vector;
	}

	public add(vectorOrNumber: LikeVector3 | number): void {
		vec3.add(this._vector, this._vector, Vector3.getArrayFromVectorOrNumber(vectorOrNumber));
	}

	public sub(vectorOrNumber: LikeVector3 | number): void {
		vec3.sub(this._vector, this._vector, Vector3.getArrayFromVectorOrNumber(vectorOrNumber));
	}

	public multiply(vectorOrFactor: LikeVector3 | number): void {
		vec3.multiply(this._vector, this._vector, Vector3.getArrayFromVectorOrNumber(vectorOrFactor));
	}

	public divide(vectorOrFactor: LikeVector3 | number): void {
		vec3.divide(this._vector, this._vector, Vector3.getArrayFromVectorOrNumber(vectorOrFactor));
	}

	public scale(factor: number): void {
		vec3.scale(this._vector, this._vector, factor);
	}

	public getDistance(vector: LikeVector3): number {
		return vec3.distance(this._vector, Vector3.getArrayFromVectorOrNumber(vector));
	}

	public getSquaredDistance(vector: LikeVector3): number {
		return vec3.squaredDistance(this._vector, Vector3.getArrayFromVectorOrNumber(vector));
	}

	public copy(vector: LikeVector3): void {
		const isArray = Array.isArray(vector);
		this.x = isArray ? vector[0] : vector.x;
		this.y = isArray ? vector[1] : vector.y;
		this.z = isArray ? vector[2] : vector.z;
	}
}

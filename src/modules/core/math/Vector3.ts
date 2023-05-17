import { ArrayOfVector3Components, LikeVector3, ObjectWithSerializationToArray } from "../types";
import { Vector3Utils } from "./Vector3Utils";

export class Vector3 implements ObjectWithSerializationToArray<ArrayOfVector3Components> {
	private _vector: ArrayOfVector3Components;

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

	constructor(vector: LikeVector3 = Vector3Utils.createEmpty()) {
		this._vector = Vector3Utils.vectorToArray(vector);
	}

	public copy(vector: LikeVector3): this {
		this._vector = Vector3Utils.vectorToArray(vector);
		return this;
	}

	public createCopy(): Vector3 {
		return new Vector3().copy(this);
	}

	public cross(vector: LikeVector3): this {
		return this.copy(Vector3Utils.cross(this, vector));
	}

	public normalize(): this {
		return this.copy(Vector3Utils.normalize(this));
	}

	public subtract(vector: LikeVector3): this {
		return this.copy(Vector3Utils.subtract(this, vector));
	}

	public add(vector: LikeVector3): this {
		return this.copy(Vector3Utils.add(this, vector));
	}

	public distance(vector: LikeVector3): number {
		return Vector3Utils.distance(this, vector);
	}

	public scale(number: number): this {
		return this.copy(Vector3Utils.scale(this, number));
	}

	public len(): number {
		return Vector3Utils.len(this);
	}

	public toArray(): ArrayOfVector3Components {
		return [...this._vector];
	}
}

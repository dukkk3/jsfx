import { Matrix3 } from "@core/math/Matrix3";
import { Vector2 } from "@core/math/Vector2";

import type { LikeVector2 } from "@core/types";
import { AbstractObject } from "./AbstractObject";

export abstract class AbstractObject2D extends AbstractObject<Vector2, Matrix3> {
	public scale: Vector2;
	public position: Vector2;
	public rotation: number;
	public translation: Vector2;
	public transformMatrix: Matrix3;

	constructor(position: LikeVector2 = new Vector2()) {
		super();

		this.rotation = 0;
		this.translation = new Vector2();
		this.scale = new Vector2([1, 1]);
		this.position = new Vector2(position);
		this.transformMatrix = Matrix3.identity();
	}

	public setTranslation(translation: LikeVector2): void {
		this.translation.copy(translation);
	}
	public setPosition(position: LikeVector2): void {
		this.position.copy(position);
	}
	public setRotation(rotation: number): void {
		this.rotation = rotation;
	}
	public setScale(scale: LikeVector2): void {
		this.scale.copy(scale);
	}

	public translateX(distance: number): void {
		this.translate([distance, 0]);
	}
	public translateY(distance: number): void {
		this.translate([0, distance]);
	}
	public translate(distance: LikeVector2): void {
		this.translation.add(distance);
	}

	public scaleX(factor: number): void {
		this.scale.copy([factor, 0]);
	}
	public scaleY(factor: number): void {
		this.scale.copy([0, factor]);
	}

	public updateTransformMatrix(convertToIdentityBeforeCalculations?: boolean): void {
		const rotation = Matrix3.arrayFromRotation(this.rotation);
		const scaling = Matrix3.arrayFromScaling(...this.scale.toArray());
		const translation = Matrix3.arrayFromTranslation(...this.translation.toArray());

		if (convertToIdentityBeforeCalculations) {
			this.transformMatrix.toIdentity();
		}

		this.transformMatrix.multiply(translation).multiply(rotation).multiply(scaling);
	}
}

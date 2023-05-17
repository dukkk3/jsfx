import { quat } from "gl-matrix";
import { LikeVector4, ArrayOfVector4Components } from "@core/types";

export class QuaternionUtils {
	public static createEmpty(): ArrayOfVector4Components {
		return [0, 0, 0, 0];
	}

	public static quaternionToArray(vector: LikeVector4): ArrayOfVector4Components {
		if ("toArray" in vector) {
			return vector.toArray();
		}

		return Array.isArray(vector) ? [...vector] : [vector.x, vector.y, vector.z, vector.a];
	}

	public static cross(a: LikeVector4, b: LikeVector4): ArrayOfVector4Components {
		const newVector = this.createEmpty();
		vec3.cross(newVector, this.vectorToArray(a), this.vectorToArray(b));
		return newVector;
	}

	public static subtract(a: LikeVector3, b: LikeVector3): ArrayOfVector3Components {
		const newVector = this.createEmpty();
		vec3.subtract(newVector, this.vectorToArray(a), this.vectorToArray(b));
		return newVector;
	}

	public static add(a: LikeVector3, b: LikeVector3): ArrayOfVector3Components {
		const newVector = this.createEmpty();
		vec3.add(newVector, this.vectorToArray(a), this.vectorToArray(b));
		return newVector;
	}

	public static normalize(vector: LikeVector3): ArrayOfVector3Components {
		const newVector = this.createEmpty();
		vec3.normalize(newVector, this.vectorToArray(vector));
		return newVector;
	}

	public static distance(a: LikeVector3, b: LikeVector3): number {
		return vec3.distance(this.vectorToArray(a), this.vectorToArray(b));
	}
}

import { vec3 } from "gl-matrix";
import { LikeVector3, ArrayOfVector3Components } from "@core/types";

export class Vector3Utils {
	public static createEmpty(): ArrayOfVector3Components {
		return [0, 0, 0];
	}

	public static vectorToArray(vector: LikeVector3): ArrayOfVector3Components {
		if ("toArray" in vector) {
			return vector.toArray();
		}

		return Array.isArray(vector) ? [...vector] : [vector.x, vector.y, vector.z];
	}

	public static cross(a: LikeVector3, b: LikeVector3): ArrayOfVector3Components {
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
}

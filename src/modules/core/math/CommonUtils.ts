import { AbstractGeometry } from "../core/abstracts/entities/AbstractGeometry";

import { MathUtils } from "./MathUtils";
import { Vector3 } from "./Vector3";

export class CommonUtils {
	public static getGeometriesExtents(geometries: AbstractGeometry<any, any>[]) {
		return geometries.reduce(
			({ min, max }, geometry) => {
				const minMax = MathUtils.getExtents(geometry.verticesAttribute.getArray());
				return {
					min: min.copy(
						min.toArray().map((min, ndx) => Math.min(minMax.min[ndx], min)) as [number, number, number]
					),
					max: max.copy(
						max.toArray().map((max, ndx) => Math.max(minMax.max[ndx], max)) as [number, number, number]
					),
				};
			},
			{
				min: new Vector3([Infinity, Infinity, Infinity]),
				max: new Vector3([-Infinity, -Infinity, -Infinity]),
			}
		);
	}
}

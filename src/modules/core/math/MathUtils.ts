export class MathUtils {
	public static degreesToRadians(degrees: number): number {
		return (degrees / 180) * Math.PI;
	}

	public static radiansToDegrees(radians: number): number {
		return (radians * 180) / Math.PI;
	}

	public static mix(x: number, y: number, t: number): number {
		return (1 - t) * x + t * y;
	}

	public static getExtents(positions: number[]) {
		const min = positions.slice(0, 3);
		const max = positions.slice(0, 3);

		for (let i = 3; i < positions.length; i += 3) {
			for (let j = 0; j < 3; ++j) {
				const v = positions[i + j];
				min[j] = Math.min(v, min[j]);
				max[j] = Math.max(v, max[j]);
			}
		}

		return { min, max };
	}
}

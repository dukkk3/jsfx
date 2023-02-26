export class MathUtils {
	public static degreesToRadians(degrees: number): number {
		return (degrees / 180) * Math.PI;
	}

	public static radiansToDegrees(radians: number): number {
		return (radians * 180) / Math.PI;
	}
}

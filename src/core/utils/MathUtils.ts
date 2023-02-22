export class MathUtils {
	public static degreesToRadians(degrees: number) {
		return (degrees * Math.PI) / 180;
	}

	public static getRandomInteger(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

export class Attribute {
	public chunksCount: number;
	public pointsCount: number;
	public points: Float32Array;

	constructor(points: Float32Array | number[], public chunkSize: number) {
		this.points = points instanceof Float32Array ? points : new Float32Array(points);
		this.pointsCount = this.points.length;
		this.chunksCount = this.points.length / chunkSize;
	}
}

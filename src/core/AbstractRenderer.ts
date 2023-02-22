import { Mesh } from "@core/objects/Mesh2D";
import { Group2D } from "@core/objects/Group2D";
import { AbstractObject } from "@core/objects/AbstractObject";
import { AbstractScene } from "@core/AbstractScene";
import shadersChunks from "@core/shaders/chunks";

import type { WebGLContext } from "./types";
import { UniformsNamesConfig } from "./config/uniforms/UniformsNamesConfig";
import { CachedShaderProgram } from "./shared/CachedShaderProgram";
import { ShaderProgram } from "./shared/ShaderProgram";
import { Matrix3 } from "./math/Matrix3";

export abstract class AbstractRenderer {
	private static meshesForEach(objects: AbstractObject[], callback: (mesh: Mesh) => void): void {
		const sortedObjects = [...objects].sort(({ zIndex: a }, { zIndex: b }) => a - b);
		sortedObjects.forEach((object) => {
			if (object instanceof Group2D) this.meshesForEach(object.objects, callback);
			else if (object instanceof Mesh && !object.hidden) callback(object);
		});
	}

	protected projectionMatrix: Matrix3;

	constructor(protected $canvas: HTMLCanvasElement, protected context: WebGLContext) {
		this.projectionMatrix = new Matrix3();
		this.updateViewportSize();
	}

	public updateViewportSize(): void {
		const width = this.$canvas.clientWidth;
		const height = this.$canvas.clientHeight;

		if (this.$canvas.width !== width || this.$canvas.height !== height) {
			this.$canvas.width = width;
			this.$canvas.height = height;
			this.updateProjectionMatrix(width, height);
		}

		this.context.viewport(0, 0, this.context.drawingBufferWidth, this.context.drawingBufferHeight);
	}

	public render(scene: AbstractScene): void {
		this.context.clearColor(0, 0, 0, 0);
		this.context.clear(this.context.COLOR_BUFFER_BIT);
		AbstractRenderer.meshesForEach(scene.objects, (mesh) => {
			const program = CachedShaderProgram(
				mesh.id,
				this.context,
				mesh.material.vertexShaderSource,
				mesh.material.fragmentShaderSource,
				shadersChunks
			);
			this.renderMesh(program, mesh);
		});
	}

	protected renderMesh(program: ShaderProgram, mesh: Mesh): void {
		program.context.useProgram(program.program);

		program.setAttributeValueByName(UniformsNamesConfig.POSITION_ATTRIBUTE_NAME, {
			chunkSize: mesh.geometry.positionAttribute.chunkSize,
		});
		program.context.bufferData(
			program.context.ARRAY_BUFFER,
			mesh.geometry.positionAttribute.points,
			program.context.STATIC_DRAW
		);

		mesh.transformMatrix.copy(this.projectionMatrix);
		mesh.updateTransformMatrix();

		this.updateMeshUniforms(program, mesh);
		program.context.drawArrays(
			program.context.TRIANGLES,
			0,
			mesh.geometry.positionAttribute.chunksCount
		);
	}

	protected updateMeshUniforms(program: ShaderProgram, mesh: Mesh): void {
		mesh.material.forceSetUniformValueByName(UniformsNamesConfig.RESOLUTION_UNIFORM_NAME, [
			this.$canvas.width,
			this.$canvas.height,
		]);
		mesh.material.forceSetUniformValueByName(
			UniformsNamesConfig.TRANSFORM_MATRIX_UNIFORM_NAME,
			mesh.transformMatrix.toArray()
		);
		mesh.material.uniformsNames.forEach((uniformName) => {
			program.setUniformValueByName(uniformName, mesh.material.uniforms[uniformName]);
		});
	}

	private updateProjectionMatrix(width: number, height: number): void {
		this.projectionMatrix.toProjection(width, height);
	}
}

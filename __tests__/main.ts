import raf from "raf";

import { ShaderMaterial } from "@api/materials/ShaderMaterial";
import { BufferGeometry } from "@api/geometries/BufferGeometry";
import { WebGLRenderer } from "@api/renderers/WebGLRenderer";
import { Scene } from "@api/scenes/Scene";

import { MathUtils } from "@core/utils/MathUtils";
import { Mesh } from "@core/objects/Mesh2D";

import fs from "./main.fs.glsl";
import vs from "./main.vs.glsl";

const $canvas = document.getElementById("scene") as HTMLCanvasElement;

const renderer = new WebGLRenderer($canvas, { antialias: true, alpha: true });

const fGeometry = new BufferGeometry(
	[
		0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150, 30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30, 30,
		60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
	],
	2
);

const meshes: Mesh<typeof fGeometry>[] = [];
const scene = new Scene();

for (let i = 0; i < 5; i++) {
	const material = new ShaderMaterial(vs, fs, { u_color: [0, 0, 0, 0.5] });
	const mesh = new Mesh(fGeometry, material);
	const color = [
		MathUtils.getRandomInteger(0, 255),
		MathUtils.getRandomInteger(0, 255),
		MathUtils.getRandomInteger(0, 255),
	];

	mesh.material.setUniformValueByName("u_color", [
		...color.map((component) => component / 255),
		0.5,
	]);
	mesh.zIndex = 4 - i;
	mesh.scale.x = mesh.scale.y = 0.5 + 0.5 * ((4 - i) / 4);
	mesh.translation.x = 40 * i;
	scene.addObjects(mesh);
	console.log(mesh);
	meshes.push(mesh);
}

const animate = (time: number = 0) => {
	renderer.render(scene);
	raf(animate);
};

window.addEventListener("resize", () => {
	renderer.updateViewportSize();
});

animate();

// import raf from "raf";

import { PerspectiveCamera } from "@cameras/PerspectiveCamera";
import { BufferGeometry } from "@geometries/BufferGeometry";
import { BasicMaterial } from "@materials/BasicMaterial";
import { Uint8Attribute, WebGLRenderer, WebGLScene, MathUtils, Vector3 } from "@core";
import { ObjectLoader } from "@loaders/ObjectLoader";

import { colorPoints, geometryPoints } from "./geometry";
import raf from "raf";

const RADIUS = 200;

const CAMERA_FOV = 60;
const CAMERA_NEAR = 1;
const CAMERA_FAR = 2000;

const material = new BasicMaterial();
const geometry = new BufferGeometry(geometryPoints, 3, {
	a_color: new Uint8Attribute(colorPoints, 3, { normalize: true }),
});

const $canvas = document.getElementById("scene") as HTMLCanvasElement;
const renderer = new WebGLRenderer($canvas, { antialias: true, alpha: true });
const camera = new PerspectiveCamera(
	MathUtils.degreesToRadians(CAMERA_FOV),
	CAMERA_FAR,
	CAMERA_NEAR
);

const scene = new WebGLScene();
const mesh1 = scene.createMesh(geometry, material);
const mesh2 = scene.createMesh(geometry, material);

camera.position.z = RADIUS * 2;

mesh1.position.x = RADIUS;

mesh2.position.x = Math.cos(30) * RADIUS;
mesh2.position.z = Math.sin(30) * RADIUS;

// camera.lookAt([RADIUS, 0, 0]);

const lookAtVector = new Vector3();

const animate = (time: number = 0) => {
	const progress = Math.sin(camera.rotation.y);
	lookAtVector.x = MathUtils.mix(mesh1.position.x, mesh2.position.x, progress);
	lookAtVector.y = MathUtils.mix(mesh1.position.y, mesh2.position.y, progress);
	lookAtVector.z = MathUtils.mix(mesh1.position.z, mesh2.position.z, progress);
	camera.lookAt(lookAtVector);
	renderer.render(scene, camera);
	raf(animate);
};

animate();

webglLessonsUI.setupSlider("#cameraAngle", {
	value: MathUtils.radiansToDegrees(camera.rotation.y),
	slide: (_, { value }) => {
		camera.rotation.y = MathUtils.degreesToRadians(value);
		animate();
	},
	min: -360,
	max: 360,
});

window.addEventListener("resize", () => {
	renderer.updateViewportSize();
	animate();
});

document.getElementById("mesh-1")!.addEventListener("click", () => {
	camera.lookAt(mesh1);
	animate();
});

document.getElementById("mesh-2")!.addEventListener("click", () => {
	camera.lookAt(mesh2);
	animate();
});

// webglLessonsUI.setupSlider("#x", {
// 	value: mesh.translate.x,
// 	slide: (_, { value }) => (mesh.translate.x = value),
// 	min: -400,
// 	max: 400,
// });
// webglLessonsUI.setupSlider("#y", {
// 	value: mesh.translate.y,
// 	slide: (_, { value }) => (mesh.translate.y = value),
// 	min: -400,
// 	max: 400,
// });
// webglLessonsUI.setupSlider("#z", {
// 	value: mesh.translate.z,
// 	slide: (_, { value }) => (mesh.translate.z = value),
// 	min: -400,
// 	max: 400,
// });
// webglLessonsUI.setupSlider("#fov", {
// 	value: camera.fov,
// 	slide: (_, { value }) => (camera.fov = MathUtils.degreesToRadians(value)),
// 	min: 1,
// 	max: 180,
// });
// webglLessonsUI.setupSlider("#geometryPoint", {
// 	value: mesh.geometry.verticesPositionAttribute.getArray()[0],
// 	slide: (_, { value }) => {
// 		geometryPoints[0] = value;
// 		mesh.geometry.verticesPositionAttribute.updateArray(geometryPoints);
// 	},
// 	max: 100,
// });
// webglLessonsUI.setupSlider("#angleX", {
// 	value: MathUtils.radiansToDegrees(mesh.rotation.x),
// 	slide: (_, { value }) => (mesh.rotation.x = MathUtils.degreesToRadians(value)),
// 	min: 0,
// 	max: 360,
// });
// webglLessonsUI.setupSlider("#angleY", {
// 	value: MathUtils.radiansToDegrees(mesh.rotation.y),
// 	slide: (_, { value }) => (mesh.rotation.y = MathUtils.degreesToRadians(value)),
// 	min: 0,
// 	max: 360,
// });
// webglLessonsUI.setupSlider("#angleZ", {
// 	value: MathUtils.radiansToDegrees(mesh.rotation.z),
// 	slide: (_, { value }) => (mesh.rotation.z = MathUtils.degreesToRadians(value)),
// 	min: 0,
// 	max: 360,
// });

declare const webglLessonsUI: {
	setupSlider: (
		id: string,
		options: {
			value: number;
			slide: (event: Event, ui: { value: number }) => void;
			min?: number;
			max?: number;
			step?: number;
			precision?: number;
		}
	) => void;
};

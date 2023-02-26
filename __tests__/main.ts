import raf from "raf";

import { Mesh, Renderer, Scene } from "@core/index";
import { Uint8Attribute } from "@core/webgl/attributes/Uint8Attribute";
import { PerspectiveCamera } from "@cameras/PerspectiveCamera";
import { BufferGeometry } from "@geometries/BufferGeometry";
import { BasicMaterial } from "@materials/BasicMaterial";
import { MathUtils } from "@core/shared/math/MathUtils";

import { colorPoints, geometryPoints } from "./geometry";

const $canvas = document.getElementById("scene") as HTMLCanvasElement;
const renderer = new Renderer($canvas, { antialias: true, alpha: true });
const radius = 200;

const colorAttribute = new Uint8Attribute(colorPoints, 3);

const camera = new PerspectiveCamera(MathUtils.degreesToRadians(60), 2000, 1);
const mesh = new Mesh(
	new BufferGeometry(geometryPoints, 3, true, { a_color: colorAttribute }),
	new BasicMaterial()
);

const scene = new Scene();

scene.addObjects(mesh);

camera.position.z = radius * 1.5;

const angle = 0;

mesh.position.x = Math.cos(angle) * radius;
mesh.position.z = Math.sin(angle) * radius;
camera.lookAt([radius, 0, 0]);

const animate = (time: number = 0) => {
	renderer.render(scene, camera);
};

window.addEventListener("resize", () => {
	renderer.updateViewportSize();
});

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

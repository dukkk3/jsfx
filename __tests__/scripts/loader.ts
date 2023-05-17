import raf from "raf";

import { WebGLRenderer, WebGLScene, MathUtils, CommonUtils, Vector3Utils } from "@core";
import { PerspectiveCamera } from "@cameras/PerspectiveCamera";
import { NormalMaterial } from "@materials/NormalMaterial";
import { ObjectLoader } from "@loaders/ObjectLoader";

const loader = new ObjectLoader();

const material = new NormalMaterial();
const $canvas = document.getElementById("scene") as HTMLCanvasElement;
const renderer = new WebGLRenderer($canvas, { antialias: true, alpha: true });
const scene = new WebGLScene();

const load = async () => {
	const { geometries } = await loader.load(
		"https://webglfundamentals.org/webgl/resources/models/chair/chair.obj"
	);

	const extents = CommonUtils.getGeometriesExtents(geometries.map(({ geometry }) => geometry));
	const range = Vector3Utils.subtract(extents.max, extents.min);
	const objectOffset = Vector3Utils.scale(
		Vector3Utils.add(extents.min, Vector3Utils.scale(range, 0.5)),
		-1
	);

	const radius = Vector3Utils.len(range) * 1.2;
	const cameraPosition = Vector3Utils.add([0, 0, 0], [0, 0, radius]);
	const zNear = radius / 100;
	const zFar = radius * 3;

	const camera = new PerspectiveCamera(MathUtils.degreesToRadians(60), zFar, zNear);

	const group = scene.createGroup();

	geometries.forEach(({ geometry }) => {
		const mesh = scene.createMesh(geometry, material);
		group.addChildren(mesh);
	});

	scene.translation.copy(objectOffset);
	// group.position.copy(objectOffset);
	camera.position.copy(cameraPosition);
	camera.lookAt(group);

	const animate = (time: number = 0) => {
		renderer.render(scene, camera);
		group.rotation.y = Math.sin(time / 1000);
		raf(animate);
	};

	animate();
};

load();

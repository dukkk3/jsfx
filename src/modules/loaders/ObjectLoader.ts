import { Float32Attribute, AbstractLoader, LoadedObject } from "@core";
import { BufferGeometry } from "@geometries/BufferGeometry";

export class ObjectLoader extends AbstractLoader {
	protected parse(source: string): LoadedObject {
		const normals: number[][] = [[0, 0, 0]];
		const positions: number[][] = [[0, 0, 0]];
		const textureCoords: number[][] = [[0, 0]];

		const vertexData = [positions, textureCoords, normals];
		let webglVertexData: any[] = [
			[], // positions
			[], // texcoords
			[], // normals
		];

		const materialLibs: any[] = [];
		const geometries: any[] = [];

		let geometry: any;
		let groups = ["default"];
		let material = "default";
		let object = "default";

		const noop = () => {};

		function newGeometry() {
			// If there is an existing geometry and it's
			// not empty then start a new one.
			if (geometry && geometry.data.position.length) {
				geometry = undefined;
			}
		}

		function setGeometry() {
			if (!geometry) {
				const position: any = [];
				const texcoord: any = [];
				const normal: any = [];
				webglVertexData = [position, texcoord, normal];
				geometry = {
					object,
					groups,
					material,
					data: {
						position,
						texcoord,
						normal,
					},
				};
				geometries.push(geometry);
			}
		}

		function addVertex(vert: string) {
			const ptn = vert.split("/");

			ptn.forEach((objIndexStr, i) => {
				if (!objIndexStr) {
					return;
				}
				const objIndex = parseInt(objIndexStr);
				const index = objIndex + (objIndex >= 0 ? 0 : vertexData[i].length);
				webglVertexData[i].push(...vertexData[i][index]);
			});
		}

		const keywords = {
			v: (parts: string[]) => {
				positions.push(parts.map(parseFloat));
			},
			vn: (parts: string[]) => {
				normals.push(parts.map(parseFloat));
			},
			vt: (parts: string[]) => {
				// should check for missing v and extra w?
				textureCoords.push(parts.map(parseFloat));
			},
			f: (parts: string[]) => {
				setGeometry();
				const numTriangles = parts.length - 2;
				for (let tri = 0; tri < numTriangles; ++tri) {
					addVertex(parts[0]);
					addVertex(parts[tri + 1]);
					addVertex(parts[tri + 2]);
				}
			},
			s: noop, // smoothing group
			mtllib(parts: string[], unparsedArgs: any) {
				// the spec says there can be multiple filenames here
				// but many exist with spaces in a single filename
				materialLibs.push(unparsedArgs);
			},
			usemtl(parts: string[], unparsedArgs: any) {
				material = unparsedArgs;
				newGeometry();
			},
			g: (parts: string[]) => {
				groups = parts;
				newGeometry();
			},
			o: (parts: string[], unparsedArgs: any) => {
				object = unparsedArgs;
				newGeometry();
			},
		};

		const keywordRE = /(\w*)(?: )*(.*)/;
		const lines = source.split("\n");

		for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
			const line = lines[lineNo].trim();
			if (line === "" || line.startsWith("#")) {
				continue;
			}
			const m = keywordRE.exec(line);
			if (!m) {
				continue;
			}
			const [, keyword, unparsedArgs] = m;
			const parts = line.split(/\s+/).slice(1);
			const handler = (keywords as any)[keyword];

			if (!handler) {
				console.warn("unhandled keyword:", keyword); // eslint-disable-line no-console
				continue;
			}
			handler(parts, unparsedArgs);
		}

		// remove any arrays that have no entries.
		for (const geometry of geometries) {
			geometry.data = Object.fromEntries(
				Object.entries(geometry.data).filter(([, array]) => (array as any[]).length > 0)
			);
		}

		return {
			geometries: geometries.map(({ data, ...geometry }) => {
				const normal = new Float32Attribute(data.normal, 3);
				const position = new Float32Attribute(data.position, 3);
				const textureCoord = new Float32Attribute(data.texcoord, 2);

				return {
					...geometry,
					geometry: new BufferGeometry(position, 3, {
						textureCoord,
						position,
						normal,
					}),
					data: {
						normal,
						position,
						textureCoord,
					},
				};
			}),
		};
	}
}

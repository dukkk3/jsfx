import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	plugins: [glsl({ include: ["**/*.glsl", "**/*.vs", "**/*.fs"] })],
	resolve: {
		alias: {
			"@core": path.resolve(__dirname, "./src/modules/core"),
			"@materials": path.resolve(__dirname, "./src/modules/materials"),
			"@geometries": path.resolve(__dirname, "./src/modules/geometries"),
			"@cameras": path.resolve(__dirname, "./src/modules/cameras"),
		},
	},
});

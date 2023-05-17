import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	plugins: [glsl({ include: ["**/*.glsl", "**/*.vs", "**/*.fs"] })],
	build: {
		rollupOptions: {
			input: {
				app: "./__tests__/index.html",
			},
		},
	},
	server: {
		open: "./__tests__/index.html",
	},
	resolve: {
		alias: {
			"@loaders": path.resolve(__dirname, "./src/modules/loaders"),
			"@core": path.resolve(__dirname, "./src/modules/core"),
			"@materials": path.resolve(__dirname, "./src/modules/materials"),
			"@geometries": path.resolve(__dirname, "./src/modules/geometries"),
			"@cameras": path.resolve(__dirname, "./src/modules/cameras"),
		},
	},
});

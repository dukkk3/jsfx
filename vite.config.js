import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	plugins: [glsl({ include: ["**/*.glsl", "**/*.vs", "**/*.fs"] })],
	resolve: {
		alias: {
			"@core": path.resolve(__dirname, "./src/core"),
			"@api": path.resolve(__dirname, "./src/api"),
		},
	},
});

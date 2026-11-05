import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// babylonjs-editor-tools references optional "@recast-navigation/*" packages
// (only needed for navmesh script assets, which we do not use). The generated
// src/scripts.ts imports their preload plugin, so we alias both packages to a
// local stub. This applies to the dev dependency optimizer, the dev reserver
// and the production rollup build at once.
const recastStub = fileURLToPath(
	new URL("./src/stubs/recast-navigation-stub.js", import.meta.url),
);
const recastAlias = {
	"@recast-navigation/core": recastStub,
	"@recast-navigation/generators": recastStub,
};

export default defineConfig({
	plugins: [tailwindcss()],
	server: {
		port: 3000,
		strictPort: true,
	},
	resolve: {
		alias: recastAlias,
	},
	optimizeDeps: {
		exclude: ["@babylonjs/havok"],
		esbuildOptions: {
			alias: recastAlias as Record<string, string>,
		},
	},
	build: {
		target: "esnext",
	},
});

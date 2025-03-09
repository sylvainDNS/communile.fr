import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	output: "server",
	adapter: cloudflare(),
});

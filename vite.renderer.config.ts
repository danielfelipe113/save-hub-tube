import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'node:path';
// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src') // This assumes that your source code is in a "src" directory
		}
	},
	plugins: [vue()],
});
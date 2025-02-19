import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "./htdocs",
		emptyOutDir: true,
	},
	css: {
		modules: {
			localsConvention: "camelCaseOnly",
		}
	}
})

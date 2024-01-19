import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
export default defineConfig({
  resolve: {},
  base: './',
  build: {
    outDir: "../../docs/.vitepress/dist/js-demo",
    minify: "terser",
    terserOptions: {
     
    },
    rollupOptions: {
      plugins: [typescript()],
    },
  },
});

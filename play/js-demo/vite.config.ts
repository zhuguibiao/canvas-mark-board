import { defineConfig } from "vite";
export default defineConfig({
  resolve: {},
  base: "./",
  build: {
    outDir: "../../docs/.vitepress/dist/js-demo",
    minify: "terser",
    terserOptions: {},
  },
});

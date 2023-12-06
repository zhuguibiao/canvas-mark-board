import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
export default defineConfig({
  resolve: {},
  base: './',
  build: {
    outDir: "../../docs/.vitepress/dist/js-demo",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      plugins: [typescript()],
    },
  },
});

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: {
    outDir: "../../docs/.vitepress/dist/vue-demo",
  },
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    conditions: ["dev"],
  },
});

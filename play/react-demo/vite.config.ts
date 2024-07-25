import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../../docs/.vitepress/dist/react-demo",
  },
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    conditions: ["dev"],
  },
});

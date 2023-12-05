import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const plugins = [
  commonjs(),
  resolve(),
  typescript({
    tsconfig: "./tsconfig.json",
    compilerOptions: {
      declaration: true,
      rootDir: ".",
      outDir: "./dist",
    },
  }),
  terser({ format: { comments: false } }),
];
let config = {
  input: "./index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "es",
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "CanvasMarkBoard",
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
  ],
  plugins: [...plugins],
};
export default config;

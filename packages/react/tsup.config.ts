import { defineConfig } from "tsup";

export default defineConfig({
  name: "@narrator-ai/react",
  entry: {
    ".": "src/index.tsx",
  },
  clean: true,
  // banner: {
  //   js: "'use client'",
  // },
  format: ["cjs", "esm"],
  external: ["react", "react-dom"],
  dts: true,
});

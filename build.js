import { buildSync } from "esbuild";

buildSync({
  entryPoints: ["src/index.js"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: "dist/index.cjs",
});

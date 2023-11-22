import { defineConfig, loadEnv } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";

const path = require("path");

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  const STEAM = env.VITE_STEAM === "true";

  return {
    plugins: [createVuePlugin()],
    base: "./",
    outDir: STEAM ? "../AppFiles" : "dist",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
  };
});
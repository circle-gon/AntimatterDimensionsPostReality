import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [createVuePlugin()],
  base: "./",
  outDir: "dist",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
});

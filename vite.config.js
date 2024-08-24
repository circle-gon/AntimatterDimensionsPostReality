import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import vue from "@vitejs/plugin-vue2";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  outDir: "dist",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".vue", ".json"],
  },
  build: {
    sourcemap: true,
  },
});

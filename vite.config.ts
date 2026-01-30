import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

export default defineConfig({
  base: "/tetris-game/",   // <-- IMPORTANT: repo name with leading+trailing slash
  plugins: [
    react(),
    tailwindcss(),
    createIconImportProxy(),
    sparkPlugin(),
  ],
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
});
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "src"),
      react: path.resolve(dirname, "node_modules/react"),
      "react-dom": path.resolve(dirname, "node_modules/react-dom"),
    },
  },
  optimizeDeps: {
    exclude: ["@gsrosa/nexploring-ui"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["src/**/*.{unit,integration}.test.{ts,tsx}"],
    css: true,
    passWithNoTests: false,
  },
});

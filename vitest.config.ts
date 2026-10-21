import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      reporter: ["text", "html"],
      exclude: ["node_modules/", "tests/e2e/"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // Same alias as tsconfig; tests that touch src/lib/actualites.ts mock it.
      "@payload-config": resolve(__dirname, "./src/payload.config.ts"),
    },
  },
});

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // This is to ensure Jest DOM matchers work properly
    include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    // Exclude node_modules and dist directory
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
    // Optional: If you want coverage reports
    // coverage: {
    //   reporter: ['text', 'json', 'html'],
    // },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});

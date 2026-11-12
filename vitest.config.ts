import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    // Each test runs a real Astro build; builds share the project's caches, so run files one at a time.
    fileParallelism: false,
    testTimeout: 120_000,
  },
});

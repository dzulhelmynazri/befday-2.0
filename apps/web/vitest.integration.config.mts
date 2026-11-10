import { fileURLToPath } from "node:url";

import { workflow } from "@workflow/vitest";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [workflow()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  test: {
    fileParallelism: false,
    hookTimeout: 30_000,
    include: ["src/workflows/**/*.integration.test.ts"],
    server: {
      deps: {
        inline: [/@workflow\/vitest/u],
      },
    },
    setupFiles: ["./vitest.integration.setup.ts"],
    testTimeout: 60_000,
  },
});

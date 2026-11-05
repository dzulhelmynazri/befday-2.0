import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import gdp from "ultracite/oxlint/gdp";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import shadcn from "ultracite/oxlint/shadcn";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, gdp, react, next, antiSlop, shadcn, vitest],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    "packages/ui/**",
    ".agents/**",
    ".claude/**",
    ".cursor/**",
    "apps/native/babel.config.js",
    "apps/native/metro.config.js",
  ],
  overrides: [
    {
      files: ["apps/native/**"],
      rules: {
        "jsx-a11y/label-has-associated-control": "off",
        "shadcn/no-inline-styles": "off",
      },
    },
    {
      files: ["src/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                message: "Use the @/* alias for imports between src modules.",
                regex: "^\\.\\./",
              },
            ],
          },
        ],
      },
    },
  ],
});

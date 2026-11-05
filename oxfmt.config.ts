import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    ".agents/**",
    ".claude/**",
    ".cursor/**",
  ],
  sortTailwindcss: {
    functions: ["clsx", "cva", "tw", "twMerge", "cn", "twJoin", "tv"],
    stylesheet: "./apps/web/app/global.css",
  },
});

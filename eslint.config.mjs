import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The landing page reproduces a Figma frame at fixed sizes, and its assets
    // (SVG vectors included) are fetched into public/landing after install
    // rather than imported. Plain <img> keeps the exact geometry and avoids
    // next/image's SVG handling, so the optimisation hint does not apply here.
    files: ["app/page.tsx", "components/landing/**/*.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

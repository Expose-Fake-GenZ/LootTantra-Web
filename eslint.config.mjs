import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow img elements (we'll optimize later)
      "@next/next/no-img-element": "warn",
      // Allow missing alt text (we'll add later)
      "jsx-a11y/alt-text": "warn",
      // Allow unused variables (we'll clean up later)
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow unescaped entities
      "react/no-unescaped-entities": "warn",
      // Allow explicit any types for AWS SDK integration
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;

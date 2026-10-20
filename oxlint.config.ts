import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["vitest", "node", "typescript"],
  categories: {
    correctness: "warn",
    suspicious: "warn",
    perf: "warn",
  },
  rules: {
    "eslint/one-var": ["off"],
    "typescript/no-explicit-any": "off",
    "eslint/no-unused-vars": "warn",
    "eslint/curly": ["off"],
    "vitest/warn-todo": "off",
    "eslint/eqeqeq": "warn",
    "eslint/prefer-template": "warn",
    "eslint/object-shorthand": "warn",
    "eslint/no-unneeded-ternary": "warn",
    "eslint/preserve-caught-error": "off",
    "typescript/no-non-null-assertion": "warn",
    "typescript/no-unsafe-declaration-merging": "error",
    "typescript/prefer-as-const": "warn",
    "typescript/no-floating-promises": "warn",
    "typescript/await-thenable": "warn",
    "typescript/triple-slash-reference": "warn",
    "typescript/no-misused-new": "warn",
  },
});

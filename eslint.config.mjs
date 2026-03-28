import nextConfig from "eslint-config-next";
import jsa11y from "eslint-plugin-jsx-a11y";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextConfig,
  // jsx-a11y is already registered by eslint-config-next — just extend its rules
  {
    rules: {
      ...jsa11y.configs.recommended.rules,
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
];

export default config;

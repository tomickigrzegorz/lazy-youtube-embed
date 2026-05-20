module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
    "comma-dangle": ["error", "only-multiline"],
    "no-param-reassign": [2, { props: false }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
  ignorePatterns: ["node_modules", "dist", "docs/js", "docs/css"],
};

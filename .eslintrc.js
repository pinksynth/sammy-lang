module.exports = {
  env: {
    commonjs: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  ignorePatterns: ["**/output/*.js"],
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
}

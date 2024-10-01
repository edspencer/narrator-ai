module.exports = {
  root: true,
  extends: ["@narrator-ai/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  ignores: ["jest.config.ts"],
  parserOptions: {
    project: true,
  },
};

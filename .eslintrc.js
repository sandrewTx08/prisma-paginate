module.exports = {
  env: {
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", 2],
    "no-console": 2,
    "@typescript-eslint/no-namespace": 0,
    "linebreak-style": ["error", "unix"],
    "@typescript-eslint/no-explicit-any": 0,
    "max-len": ["error", { code: 80, ignoreComments: true }],
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
};

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: {
    indent: [
      "error",
      2,
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    semi: [
      "error",
      "always",
    ],
    "no-trailing-spaces": [
      "error",
      {ignoreComments: true},
    ],
    "eol-last": [
      "error",
      "always",
    ],
    "no-unused-vars": [
      "error",
      {argsIgnorePattern: "^_"},
    ],
    "comma-dangle": [
      "error",
      "always-multiline",
    ],
  },
};

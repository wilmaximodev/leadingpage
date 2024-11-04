const { ESLint } = require("eslint");

/** @type {import("eslint").ESLint.Options} */
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "array-bracket-newline": ["error", { "multiline": true }],
      "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
      "arrow-spacing": ["error", { "before": true, "after": true }],
      "object-curly-spacing": ["error", "always"],
      "no-multi-spaces": "error",
      "no-trailing-spaces": "error",
      "newline-per-chained-call": ["error", { "ignoreChainWithDepth": 2 }]
    },
  },
];

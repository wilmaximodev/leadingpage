import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      indent: ["error", 2],           // Define indentação de 2 espaços
      "no-multi-spaces": ["error"],  // Proíbe múltiplos espaços desnecessários
    },
  },
  pluginJs.configs.recommended,
];

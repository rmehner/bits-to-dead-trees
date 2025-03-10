import globals from "globals";
// @ts-ignore
import pluginJs from "@eslint/js";
// @ts-ignore
import pluginPromise from "eslint-plugin-promise";
import nodePlugin from "eslint-plugin-n";
// @ts-ignore
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  {
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
      ecmaVersion: 2024,
    },
  },
  pluginJs.configs.recommended,
  nodePlugin.configs["flat/recommended-module"],
  {
    rules: {
      "n/no-unpublished-import": "off",
    },
  },
  pluginPromise.configs["flat/recommended"],
  eslintConfigPrettier,
];

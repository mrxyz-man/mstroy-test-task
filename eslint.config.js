import js from "@eslint/js";
import eslintPluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["eslint.config.js"],
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
  },
  {
    rules: {
      // Base
      "no-console": "warn",
      "no-debugger": "warn",

      // Vue
      "vue/multi-word-component-names": "off",
      "vue/valid-v-slot": ["error", { allowModifiers: true }],
    },
  },
];

import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginVue from "eslint-plugin-vue";

export default [
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  ...eslintPluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
];

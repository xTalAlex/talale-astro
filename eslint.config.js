import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import importX from "eslint-plugin-import-x";
import eslintPluginVue from "eslint-plugin-vue";

export default [
  ...eslintPluginAstro.configs["recommended"],
  ...eslintPluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    plugins: {
      "import-x": importX,
    },
    rules: {
      "astro/jsx-a11y/media-has-caption": "off",
      "import-x/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
];

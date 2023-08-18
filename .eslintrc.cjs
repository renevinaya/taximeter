/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  "extends": [
    "plugin:vue/strongly-recommended",
    "plugin:vue/vue3-strongly-recommended",
    "@vue/typescript/recommended"
  ],
parserOptions: {
    ecmaVersion: 2020,
  },
};

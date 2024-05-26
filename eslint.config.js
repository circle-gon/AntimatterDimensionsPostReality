import js from "@eslint/js"
import vue from "eslint-plugin-vue"
import prettier from "eslint-config-prettier"

export default [
    js.configs.recommended,
    ...vue.configs["flat/vue2-recommended"],
    {
        files: ["**/*.{js,vue}"],
        ignores: ["public/**/*.js", "src/components/SliderComponent.vue", "src/supported-browsers.js", "src/steam/bindings/PlayFabClientApi.js"],
        rules: {
    "sort-imports": [
      "warn",
      {
        "ignoreCase": true,
        "allowSeparatedGroups": true
      }
    ],
    "no-console": "warn",
    "no-template-curly-in-string": "warn",
    "array-callback-return": "error",
    "complexity": "warn",
    "consistent-return": "error",
    "dot-notation": "error",
    "eqeqeq": "error",
    "no-else-return": [
      "error",
      {
        "allowElseIf": false
      }
    ],
    "vue/one-component-per-file": "error",
    "vue/component-definition-name-casing": "warn",
    "vue/order-in-components": "warn",
    "vue/require-prop-type-constructor": "warn",
    "vue/require-default-prop": "warn",
    "vue/html-comment-content-newline": "warn",
    "vue/html-comment-content-spacing": "warn",
    "vue/html-comment-indent": "warn",
    "vue/padding-line-between-blocks": "warn",
    "vue/no-multiple-objects-in-class": "warn",
    "vue/no-static-inline-styles": "warn",
    "vue/no-v-html": "off",
    "no-empty-function": "error",
    "no-eval": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-implicit-coercion": "error",
    "no-implied-eval": "error",
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-multi-str": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    "no-proto": "error",
    "no-return-await": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-unmodified-loop-condition": "error",
    "no-unused-expressions": "error",
    "no-useless-call": "error",
    "no-useless-catch": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "no-void": "error",
    "no-with": "error",
    "radix": "warn",
    "require-await": "error",
    "require-unicode-regexp": "error",
    "yoda": "error",
    "no-label-var": "error",
    "no-shadow": "error",
    "no-shadow-restricted-names": "error",
    "no-undef": "off",
    "no-unused-vars": [
      "error",
      {
        "vars": "local",
        "args": "after-used"
      }
    ],
    "no-use-before-define": [
      "error",
      {
        "functions": false,
        "variables": false
      }
    ],
    "camelcase": [
      "error",
      {
        "allow": ["sha512_256"]
      }
    ],
    "capitalized-comments": [
      "error",
      "always",
      {
        "ignoreConsecutiveComments": true
      }
    ],
    "consistent-this": "error",
    "id-blacklist": ["error", "ret", "helper", "temp", "tmp"],
    "line-comment-position": "error",
    "lines-between-class-members": [
      "error",
      "always",
      {
        "exceptAfterSingleLine": true
      }
    ],
    "max-depth": "warn",
    "max-params": "warn",
    "multiline-comment-style": ["error", "separate-lines"],
    "no-array-constructor": "warn",
    "no-inline-comments": "error",
    "no-lonely-if": "error",
    "no-multi-assign": "warn",
    "no-negated-condition": "error",
    "no-nested-ternary": "error",
    "no-new-object": "error",
    "no-unneeded-ternary": "error",
    "operator-assignment": "error",
    "spaced-comment": "error",
    "strict": ["error", "global"],
    "arrow-body-style": "error",
    "no-duplicate-imports": "error",
    "no-useless-computed-key": "error",
    "no-useless-constructor": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error"
        }
    },
    prettier
]
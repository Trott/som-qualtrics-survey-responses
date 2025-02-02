module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    /* Possible Errors http://eslint.org/docs/rules/#possible-errors */
    "comma-dangle": [2, "only-multiline"],
    "radix": [2, "always"],
    /* Stylistic Issues http://eslint.org/docs/rules/#stylistic-issues */
    indent: [2, 2], /* two-space indentation */
    semi: 2, /* require semi-colons */
    camelcase: 2, /* require camelCase variables */
    'no-trailing-spaces': "error", //don't allow whitespace at the end of lines
    'eol-last': ["error", "always"], //require an empty line at the end of a file
    'no-multiple-empty-lines': ["error", { max: 2, maxEOF: 1, maxBOF: 0 }], //only one empty line allowed, none at the start of a file
    'curly': ["error", "all"], //prevent single line blocks without curlys
    "sort-imports": 2, //sort imports alphabetically
    "prefer-const": "error", //const > let
  },
};

module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "airbnb-base",
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "parser": "babel-eslint",
  "rules": {
    "quotes": [2, "double", { "avoidEscape": false }],
    "import/no-named-as-default": 0,
    "import/no-named-as-default-member": 0,
    "quote-props": 0,
    "prefer-arrow-callback": 1,
    "arrow-spacing": 1,
    "import/no-unresolved": 0,
  },
};

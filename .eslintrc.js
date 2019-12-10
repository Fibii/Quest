module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "semi": [
      "error",
      "never"
    ],
    "import/extensions": "off",
    "no-console": "off",
    "no-alert": "off",
    "no-shadow": "off",
  },
};

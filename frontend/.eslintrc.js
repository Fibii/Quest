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
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "semi": [
      "error",
      "never"
    ],
    "react/jsx-filename-extension": [0],
    "import/extensions": "off",
    "no-console": "off",
    "no-alert": "off",
    "no-shadow": "off",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off"
  },
};

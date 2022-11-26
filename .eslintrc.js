module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': 'off',
    'comma-dangle': 'off',
    'react/jsx-filename-extension': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-var-requires': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error',
    semi: [2, 'always'],
  },
};

module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ['standard', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'prefer-promise-reject-errors': 'off',
  },
};

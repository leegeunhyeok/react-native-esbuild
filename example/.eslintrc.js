const { resolve } = require('node:path');

const project = resolve(__dirname, 'tsconfig.json');

/** @type { import('eslint').ESLint.ConfigData } */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
  ],
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  overrides: [
    {
      files: ['*.ts?(x)', '*.js?(x)'],
      rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': 'off',
        'no-console': 'off',
        'unicorn/filename-case': 'off',
        'prettier/prettier': 'error',
      },
    },
    {
      files: ['*.test.ts?(x)', '*.spec.js?(x)'],
      rules: {
        'import/no-named-as-default-member': 'off',
      },
    },
  ],
};

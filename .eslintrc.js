const { resolve } = require('node:path');

const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  env: {
    node: true,
  },
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
      files: ['*.ts'],
      rules: {
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': 'off',
        'unicorn/filename-case': 'off',
        '@typescript-eslint/prefer-reduce-type-parameter': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
};

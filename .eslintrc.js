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
        'unicorn/filename-case': 'off',
        'import/no-named-as-default-member': 'off',
        'eslint-comments/disable-enable-pair': 'off',
        'prettier/prettier': 'error',
        '@typescript-eslint/prefer-reduce-type-parameter': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
      },
    },
    {
      files: ['**/build/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['example/**/*'],
      rules: {
        'no-console': 'off',
        'unicorn/filename-case': 'off',
      },
    },
    {
      files: ['**/*.test.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
};

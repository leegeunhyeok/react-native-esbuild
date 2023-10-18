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
        'new-cap': 'off',
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': 'off',
        'unicorn/filename-case': 'off',
        'import/no-named-as-default-member': 'off',
        'no-bitwise': 'off',
        'eslint-comments/disable-enable-pair': 'off',
        'prettier/prettier': 'error',
        '@typescript-eslint/prefer-reduce-type-parameter': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      },
    },
    {
      files: ['**/build/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['packages/hmr/lib/runtime/*.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
    {
      files: ['packages/jest/lib/**/*.ts'],
      rules: {
        'import/no-default-export': 'off',
        'import/no-named-as-default': 'off',
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
        '@typescript-eslint/unbound-method': 'off',
      },
    },
    {
      files: ['**/*.config.[tj]s'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};

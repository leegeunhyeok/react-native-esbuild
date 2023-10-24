---
title: Jest
sidebar_position: 3
slug: /jest
---

# Testing with Jest

`react-native-esbuild/jest` is a [Jest](https://jestjs.io) transformer.

It can replace [babel-jest](https://github.com/facebook/react-native/blob/v0.72.6/packages/react-native/jest-preset.js#L18) and supports the React Native testing environment.

## Setup

```bash
# using npm
npm install -D @react-native-esbuild/jest

# using yarn
yarn add -D @react-native-esbuild/jest
```

Open your `jest.config.js` and set `@react-native-esbuild/jest` as transformer.

```js
// Many react-native npm modules unfortunately don't pre-compile their source code before publishing.
// If you have npm dependencies that have to be transformed you can add the package name to list. 
const TRANSFORM_PACKAGES = [
  'react-native',
  'jest-react-native',
  '@react-native',
  '@react-native-community',
  '@react-navigation',
  // ...
];

/**
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(t|j)sx?$': '@react-native-esbuild/jest',
  },
  transformIgnorePatterns: [
    `node_modules/(?!${TRANSFORM_PACKAGES.join('|')})/`,
  ],
};
```

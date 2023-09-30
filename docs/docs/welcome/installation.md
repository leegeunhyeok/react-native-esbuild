---
title: Installation
sidebar_position: 2
slug: /installation
---

# Installation

```bash
# using npm
npm install -D @react-native-esbuild/cli

# using yarn
yarn add -D @react-native-esbuild/cli
```

## Configuration

Create `react-native-esbuild.js` to project root.

```js
/**
 * @type {import('@react-native-esbuild/core').Config}
 */
exports.default = {};
```

for more details, go to [Configuration](/configuration/basic).

## Native Setup

If you want to integrate with build processes, go to Native Setup([Android](/native-setup/android), [iOS](/native-setup/ios)) guide.

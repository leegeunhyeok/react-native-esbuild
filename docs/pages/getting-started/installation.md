# Installation

Requirements: `Node>=16`

```bash
# using npm
npm install -D @react-native-esbuild/cli

# using yarn
yarn add -D @react-native-esbuild/cli
```

## Configuration

Add `.rne` and `.swc` to `.gitignore`.

```sh
# @react-native-esbuild's local cache directory for development environment
.rne

# swc plugins
.swc
```

And create `react-native-esbuild.config.js` to project root.

```js
/**
 * @type {import('@react-native-esbuild/core').Config}
 */
exports.default = {};
```

for more details, go to [Configuration](/configuration/basic-configuration).

## Native Setup

If you want to integrate with build processes, go to Native Setup([Android](/native-setup/android), [iOS](/native-setup/ios)) guide.

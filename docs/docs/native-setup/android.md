---
title: Android
sidebar_position: 1
slug: /native-setup/android
---

# Android

## Set custom cli

Open `android/app/build.gradle` and add configuration.

### React Native >= 0.71.x

Add `cliFile` to react configuration.

```go
react {
  cliFile = file("../../node_modules/@react-native-esbuild/cli/dist/index.js")
}
```

### React Native <= 0.70.x

Add `cliPath` to react configuration.

```go
project.ext.react = [
  cliPath: "../../node_modules/@react-native-esbuild/cli/dist/index.js"
]
```

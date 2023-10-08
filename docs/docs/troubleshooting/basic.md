---
title: Basics
sidebar_position: 1
slug: /trouble-shooting/basics
---

# Troubleshooting

## On build time

- Try rebuild with `--reset-cache` flag
- When `Syntax Error` occurs
  - Target library may be using [Flow](https://flow.org).
  - Add the package name to `stripFlowPackageNames` in configuration file.
- When unknown error occurs
  - Add the package name to `fullyTransformPackageNames` in configuration file.
- Please [report issue](https://github.com/leegeunhyeok/react-native-esbuild/issues) and share demo code for reproduce the issue.

## On runtime

There're many reasons for runtime errors, making it difficult to determine the cause.

Please [report issue](https://github.com/leegeunhyeok/react-native-esbuild/issues) and share demo code for reproduce the issue.

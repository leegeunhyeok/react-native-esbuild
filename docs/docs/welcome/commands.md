---
title: Commands
sidebar_position: 3
slug: /commands
---

# Commands

React Native Esbuild's cli is partially compatible with the [React Native cli](https://github.com/react-native-community/cli) commands.

The following commands are compatible.

| Command | Status |
|:---|:---|
| start | support |
| bundle | support |
| ram-bundle | not supported |

## Start

Start the development server for Native(Android, iOS).

```bash
rne start
```

| Option | Description | Default value |
|:--|:--|:--|
| `--host` | Set the server host | `localhost` |
| `--port` | Set the server port | `8081` |
| `--verbose` | Print all logs | `false` |
| `--reset-cache` | Reset transform cache | `false` |

## Serve

Start the development server for Web.

```bash
rne serve
```

| Option | Description | Default value |
|:--|:--|:--|
| `--entry-file` | Set the entry file path | `index.web.js` |
| `--host` | Set the server host | `localhost` |
| `--port` | Set the server port | `8081` |
| `--template` | Set the template file path | Path to [default template](/web#default-template) |
| `--dev` | Set as development environment | `true` |
| `--minify` | Enable minify | `false` |
| `--verbose` | Print all logs | `false` |
| `--reset-cache` | Reset transform cache | `false` |

## Bundle

Build the bundle for the provided JavaScript entry file.

```bash
rne bundle --platform=<android | ios | web> --bundle-output=path/to/bundle
```

| Option | Description | Default value |
|:--|:--|:--|
| `--entry-file` | Set the entry file path | `index.js` |
| `--platform` | (Required) Set the target platform for resolve modules | |
| `--bundle-output` | (Required) Specify the path to store the resulting bundle | |
| `--sourcemap-output` | Specify the path to store the source map file for the resulting bundle | |
| `--assets-dest` | Specify the directory path for storing assets referenced in the bundle | |
| `--dev` | Set as development environment | `true` |
| `--minify` | Enable minify | `false` |
| `--metafile` | Export [Esbuild metafile](https://esbuild.github.io/api/#metafile) to working directory | `false` |
| `--verbose` | Print all logs | `false` |
| `--reset-cache` | Reset transform cache | `false` |

## Cache

Utilities for cache.

### Clear

Clear transform cache in the temporary directory.

```bash
rne cache clear
```

---
title: Getting Started
sidebar_position: 1
slug: /
---

# Welcome to React Native Esbuild

<div className="welcome-banner">
  <img alt="logo" src="/img/logo.png" className="animate-logo" />
  <img src="/img/logo-without-background.png" className="over-wrap" />
</div>

<div style={{ textAlign: 'center' }}>
  <img alt="npm" src="https://img.shields.io/npm/v/@react-native-esbuild/core?color=000000&style=flat-square"/>
  <br/>
  An extremely fast bundler + React Native<br/>
Developed by <a href="https://github.com/leegeunhyeok">Geunhyeok LEE (@leegeunhyeok)</a>
</div>

## Highlights

- ⚡️ Blazing Fast Build
- 🌳 Supports Tree Shaking
- 💾 In-memory & Local File System Caching
- 🎨 Flexible & Extensible
- 🔥 Supports Hermes Runtime
- 🔄 Supports Live Reload
- 🐛 Supports Debugging(Flipper, Chrome Debugger)
- 🌍 Supports All Platforms(Android, iOS, Web)
- ✨ New Architecture Ready

👉 See a demo application built with a web target [here](https://rne-web-demo.vercel.app).

## Motivation

> A Modern Bundler for React Native that supports all platforms.

React Native is a great application development framework based on the JavaScript ecosystem(including React community).

The JavaScript ecosystem is strong enough on its own, but React Native is mostly focused on developing native(Android, iOS) applications.

That's why I've developed a modern bundler that supports all platforms to take full advantage of React Native's strengths.

It aims to build for all platforms with just one bundler without complicated setup and provide a good DX(Development Experience).

## Architecture

- [Esbuild](https://esbuild.github.io): for transform source and bundling (minify, mangle, tree shaking)
- [Swc](https://swc.rs): for transform source to es5
- [Sucrase](https://github.com/alangpierce/sucrase): for strip flow syntax
- [Babel](https://babeljs.io): for transform with plugins

<details><summary>Transformer</summary>

```mermaid
flowchart TD
    subgraph SWC["@swc/core"]
        SWC_TRANSFORM[transform]
    end

    subgraph BABEL["@babel/core"]
        BABEL_LOAD_CONFIG[loadConfig] --> BABEL_TRANSFORM
        BABEL_TRANSFORM[transform]
    end

    subgraph SUCRASE[sucrase]
        SUCRASE_TRANSFORM[transform]
    end

    %% 1. should fully transform
    START[Transformer] -->|Code| COND_FULLY_TRANSFORM{shouldFullyTransform?}
    COND_FULLY_TRANSFORM -.->|"Yes\n(use metro babel preset)"| BABEL

    %% 2. should strip flow
    COND_FULLY_TRANSFORM -->|No| COND_STRIP_FLOW{"isFlow || shouldStripFlow?"}
    BABEL -.->|From fully transform| DONE([End])
    SUCRASE --> COND_CUSTOM_TRANSFORM
    BABEL --> SWC
    COND_STRIP_FLOW -->|Yes| SUCRASE

    %% 3. has custom rule
    COND_STRIP_FLOW -->|No| COND_CUSTOM_TRANSFORM{customTransformRules}
    COND_CUSTOM_TRANSFORM -->|Yes| BABEL
    COND_CUSTOM_TRANSFORM -->|No| SWC
    SWC --> DONE([End])
```

</details>

<details><summary>Caching</summary>

```mermaid
flowchart TD
    subgraph CACHE[CacheController]
        getCacheHash
        readFromMemory
        readFromFileSystem
        writeToMemory
        writeToFileSystem
    end

START([Code]) --> getCacheHash
getCacheHash -->|"Cache Key\nmd5(task id + modified at + path)"|readFromMemory

%% 1. read from memory
readFromMemory --> COND_MEMORY_CACHE{has cache?}
COND_MEMORY_CACHE -->|NO| readFromFileSystem
COND_MEMORY_CACHE -->|YES| DONE(["End"])

%% 2. read from fs
readFromFileSystem --> COND_FS_CACHE{has cache?}
COND_FS_CACHE -->|NO| TRANSFORM[Transform]
COND_FS_CACHE -->|"YES\n(File system cache)"| writeToMemory

%% 3. cache not found
TRANSFORM -.->|Transformed Code| writeToMemory
writeToMemory -.-> writeToFileSystem
writeToFileSystem -.-> DONE
writeToMemory --> DONE
```

</details>

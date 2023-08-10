# Architecture

## Transformer

- [esbuild](https://esbuild.github.io): for transform source and bundling (minify, mangle, tree shaking)
- [swc](https://swc.rs): for transform source to es5
- [sucrase](https://github.com/alangpierce/sucrase): for strip flow syntax
- [babel](https://babeljs.io): for transform with plugins

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

## Caching

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

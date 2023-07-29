import type { Plugin } from 'esbuild';

export type PluginCreator<Config> = (config: Config) => Plugin;

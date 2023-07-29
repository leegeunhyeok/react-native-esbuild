import fs from 'node:fs/promises';
import babel, {
  type TransformOptions as BabelTransformOptions,
  type BabelFileResult,
} from '@babel/core';
import swc from '@swc/core';
import type { OnLoadArgs, OnLoadResult } from 'esbuild';
import { getBabelOptions, getSwcOptions } from '@react-native-esbuild/config';
import { promisify, isFlow } from './helpers';
import type { PluginCreator } from './types';

interface HermesTransformPluginConfig {
  filter?: RegExp;
  enableCache?: boolean;
  fullyTransformPackageName?: string[];
}

const DEFAULT_CONFIG = {
  filter: /\.(?:[mc]js|[tj]sx?)$/,
  enableCache: true,
  fullyTransformPackageName: ['react-native'] as string[],
} as const;

const transformWithBabel = async (
  source: string,
  args: OnLoadArgs,
  customOptions?: BabelTransformOptions,
): Promise<string> => {
  const options = babel.loadOptions({
    ...getBabelOptions(customOptions),
    filename: args.path,
    caller: {
      name: '@react-native-esbuild/plugins',
    },
  });

  if (!options) {
    throw new Error('cannot load babel options');
  }

  const { code } = await promisify<BabelFileResult>((handler) => {
    babel.transform(source, options, handler);
  });

  if (typeof code !== 'string') {
    throw new Error('babel transformed source is empty');
  }

  return code;
};

const transformWithSwc = async (
  source: string,
  args: OnLoadArgs,
): Promise<string> => {
  const options = getSwcOptions({ filename: args.path });
  const { code } = await swc.transform(source, options);

  if (typeof code !== 'string') {
    throw new Error('swc transformed source is empty');
  }

  return code;
};

export const createHermesTransformPlugin: PluginCreator<
  HermesTransformPluginConfig
> = (config) => ({
  name: 'hermes-transform-plugin',
  setup: (build): void => {
    const {
      filter,
      fullyTransformPackageName,
      // TODO: need to implement caching features
      enableCache: _enableCache,
    } = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    build.onLoad({ filter }, async (args) => {
      let source = await fs.readFile(args.path, { encoding: 'utf-8' });
      const fullyTransform = fullyTransformPackageName.some((packageName) =>
        args.path.includes(`/node_modules/${packageName}`),
      );

      if (isFlow(source, args.path)) {
        source = await transformWithBabel(source, args, {
          babelrc: false,
          plugins: [
            '@babel/plugin-syntax-flow',
            '@babel/plugin-transform-flow-strip-types',
            '@babel/plugin-syntax-jsx',
          ],
        });
      }

      if (fullyTransform) {
        source = await transformWithBabel(source, args, {
          // follow babelrc of react-native project's root (same as metro)
          babelrc: true,
        });
      }

      return {
        contents: await transformWithSwc(source, args),
        loader: 'js',
      } as OnLoadResult;
    });
  },
});

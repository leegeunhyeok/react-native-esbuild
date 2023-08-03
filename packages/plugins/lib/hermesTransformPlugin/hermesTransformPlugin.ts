import fs from 'node:fs/promises';
import {
  loadOptions as loadBabelOptions,
  transform as babelTransform,
  type TransformOptions as BabelTransformOptions,
  type BabelFileResult,
} from '@babel/core';
import { transform as swcTransform } from '@swc/core';
import type { OnLoadArgs, OnLoadResult } from 'esbuild';
import { getBabelOptions, getSwcOptions } from '@react-native-esbuild/config';
import { promisify, isFlow } from '../helpers';
import type { PluginCreator, HermesTransformPluginConfig } from '../types';

const transformWithBabel = async (
  source: string,
  args: OnLoadArgs,
  customOptions?: BabelTransformOptions,
): Promise<string> => {
  const options = loadBabelOptions({
    ...getBabelOptions(customOptions),
    filename: args.path,
    caller: {
      name: '@react-native-esbuild/plugins',
    },
  });

  if (!options) {
    throw new Error('cannot load babel options');
  }

  const { code } = await promisify<BabelFileResult>((handler) =>
    babelTransform(source, options, handler),
  );

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
  const { code } = await swcTransform(source, options);

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
      fullyTransformPackageNames = [],
      // TODO: need to implement caching features
      enableCache: _enableCache,
    } = config;

    const fullyTransformPackagesRegExp = fullyTransformPackageNames.length
      ? new RegExp(`node_modules/${fullyTransformPackageNames.join('|')}/`)
      : undefined;

    build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
      let source = await fs.readFile(args.path, { encoding: 'utf-8' });

      if (isFlow(source, args.path)) {
        source = await transformWithBabel(source, args, {
          babelrc: false,
          plugins: [
            // babel plugins in metro preset
            // https://github.com/facebook/react-native/blob/main/packages/react-native-babel-preset/src/configs/main.js
            '@babel/plugin-syntax-flow',
            '@babel/plugin-transform-flow-strip-types',
            '@babel/plugin-syntax-jsx',
          ],
        });
      }

      if (
        source.includes('react-native-reanimated') ||
        fullyTransformPackagesRegExp?.test(args.path)
      ) {
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

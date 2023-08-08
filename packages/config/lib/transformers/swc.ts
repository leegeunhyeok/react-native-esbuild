import deepmerge from 'deepmerge';
import type { EsParserConfig, Options, TsParserConfig } from '@swc/core';
import type { SwcPresetOptions } from '../types';

export function getSwcOptions(
  options: SwcPresetOptions,
  customSwcOptions?: Partial<Options>,
): Options {
  const isTS = /\.tsx?$/.test(options.filename);
  const parseOption = isTS
    ? ({
        syntax: 'typescript',
        tsx: true,
        dynamicImport: true,
      } as TsParserConfig)
    : ({
        syntax: 'ecmascript',
        jsx: true,
        exportDefaultFrom: true,
      } as EsParserConfig);

  const baseOptions: Options = {
    minify: false,
    sourceMaps: false,
    isModule: true,
    inputSourceMap: false,
    inlineSourcesContent: false,
    root: options.root,
    jsc: {
      parser: parseOption,
      target: 'es5',
      loose: false,
      externalHelpers: true,
      keepClassNames: true,
    },
  };

  return customSwcOptions
    ? deepmerge(baseOptions, customSwcOptions)
    : baseOptions;
}

import type { TransformOptions } from '@babel/core';
import type {
  Options as SwcOptions,
  JsMinifyOptions as SwcJsMinifyOptions,
} from '@swc/core';

export type Transformer<Options> = (
  code: string,
  context: { path: string; root: string },
  options?: Options,
) => Promise<string>;

export interface BabelTransformerOptions {
  fullyTransform?: boolean;
  customOptions?: TransformOptions;
}

export interface SwcTransformerOptions {
  customOptions?: SwcOptions;
}

export interface SwcMinifierOptions {
  customOptions?: SwcJsMinifyOptions;
}

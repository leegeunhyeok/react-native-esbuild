import { getPreludeScript } from '@react-native-esbuild/internal';
import {
  stripFlowWithSucrase,
  minifyWithSwc,
} from '@react-native-esbuild/transformer';
import type { BundleOptions } from '@react-native-esbuild/config';

export const getTransformedPreludeScript = async (
  bundleOptions: BundleOptions,
  root: string,
): Promise<string> => {
  const context = { root, path: '' };
  const preludeScript = await getPreludeScript(bundleOptions, root);

  /**
   * remove "use strict";
   * @see {@link https://github.com/alangpierce/sucrase/issues/787#issuecomment-1483934492}
   */
  const strippedScript = (await stripFlowWithSucrase(preludeScript, context))
    .replace(/"use strict";/, '')
    .trim();

  return bundleOptions.minify
    ? minifyWithSwc(strippedScript, context, {
        compress: true,
        mangle: true,
        sourceMap: false,
      })
    : strippedScript;
};

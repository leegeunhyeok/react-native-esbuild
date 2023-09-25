import { getPreludeScript } from '@react-native-esbuild/internal';
import {
  stripFlowWithSucrase,
  minifyWithSwc,
} from '@react-native-esbuild/transformer';
import type { BundleConfig } from '@react-native-esbuild/config';

export const getTransformedPreludeScript = async (
  bundleConfig: BundleConfig,
  root: string,
): Promise<string> => {
  const context = { root, path: '' };
  const preludeScript = await getPreludeScript(bundleConfig, root);

  /**
   * remove "use strict";
   * @see {@link https://github.com/alangpierce/sucrase/issues/787#issuecomment-1483934492}
   */
  const strippedScript = (await stripFlowWithSucrase(preludeScript, context))
    .replace(/"use strict";/, '')
    .trim();

  return bundleConfig.minify
    ? minifyWithSwc(strippedScript, context, {
        compress: true,
        mangle: true,
        sourceMap: false,
      })
    : strippedScript;
};

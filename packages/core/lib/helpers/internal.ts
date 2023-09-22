import { getPreludeScript } from '@react-native-esbuild/internal';
import {
  stripFlowWithSucrase,
  minifyWithSwc,
} from '@react-native-esbuild/transformer';
import type { BundleConfig } from '@react-native-esbuild/config';

export async function getTransformedPreludeScript(
  bundleConfig: BundleConfig,
  root: string,
): Promise<string> {
  const context = { root, path: '' };
  const preludeScript = await getPreludeScript(bundleConfig, root);
  const strippedScript = await stripFlowWithSucrase(preludeScript, context);

  return bundleConfig.minify
    ? minifyWithSwc(strippedScript, context, {
        compress: true,
        mangle: true,
        sourceMap: false,
      })
    : strippedScript;
}

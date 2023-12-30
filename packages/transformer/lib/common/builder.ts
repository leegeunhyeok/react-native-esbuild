import type { BundleOptions, Config } from '@react-native-esbuild/shared';
import { getReactNativeInitializeCore } from '@react-native-esbuild/internal';
import { AsyncTransformPipeline } from '../pipelines';
import { swcPresets } from '../transformer';

export const getCommonReactNativeRuntimePipelineBuilder = (
  root: string,
  config: Config,
  bundleOptions: BundleOptions,
  { hmrEnabled }: { hmrEnabled: boolean },
): InstanceType<typeof AsyncTransformPipeline.builder> => {
  const {
    stripFlowPackageNames = [],
    fullyTransformPackageNames = [],
    additionalTransformRules,
  } = config.transformer ?? {};
  const additionalBabelRules = additionalTransformRules?.babel ?? [];
  const additionalSwcRules = additionalTransformRules?.swc ?? [];
  const injectScriptPaths = [
    getReactNativeInitializeCore(root),
    // `hmr/runtime` should import after `initializeCore` initialized.
    hmrEnabled ? '@react-native-esbuild/hmr/runtime' : undefined,
  ].filter(Boolean) as string[];

  const builder = new AsyncTransformPipeline.builder({
    root,
    entry: bundleOptions.entry,
    dev: bundleOptions.dev,
  })
    .setSwcPreset(swcPresets.getReactNativeRuntimePreset())
    .setInjectScripts(injectScriptPaths)
    .setFullyTransformPackages(fullyTransformPackageNames)
    .setStripFlowPackages(stripFlowPackageNames)
    .setAdditionalBabelTransformRules(additionalBabelRules)
    .setAdditionalSwcTransformRules(additionalSwcRules);

  return builder;
};

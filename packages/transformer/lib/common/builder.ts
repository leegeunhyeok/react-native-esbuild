import type { BuildContext } from '@react-native-esbuild/shared';
import { getReactNativeInitializeCore } from '@react-native-esbuild/internal';
import { AsyncTransformPipeline } from '../pipelines';
import { swcPresets } from '../transformer';

export const getCommonReactNativeRuntimePipelineBuilder = (
  context: BuildContext,
): InstanceType<typeof AsyncTransformPipeline.builder> => {
  const {
    stripFlowPackageNames = [],
    fullyTransformPackageNames = [],
    additionalTransformRules,
  } = context.config.transformer ?? {};
  const additionalBabelRules = additionalTransformRules?.babel ?? [];
  const additionalSwcRules = additionalTransformRules?.swc ?? [];
  const injectScriptPaths = [
    getReactNativeInitializeCore(context.root),
    // `hmr/runtime` should import after `initializeCore` initialized.
    context.hmrEnabled ? '@react-native-esbuild/hmr/runtime' : undefined,
  ].filter(Boolean) as string[];

  const builder = new AsyncTransformPipeline.builder({
    dev: context.bundleOptions.dev,
    entry: context.bundleOptions.entry,
    root: context.root,
  })
    .setSwcPreset(swcPresets.getReactNativeRuntimePreset())
    .setInjectScripts(injectScriptPaths)
    .setFullyTransformPackages(fullyTransformPackageNames)
    .setStripFlowPackages(stripFlowPackageNames)
    .setAdditionalBabelTransformRules(additionalBabelRules)
    .setAdditionalSwcTransformRules(additionalSwcRules);

  return builder;
};

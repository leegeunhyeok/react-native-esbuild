import type { ScopedTransformContext } from '@react-native-esbuild/shared';
import {
  transformSyncWithBabel,
  transformSyncWithSwc,
  stripFlowWithSucrase,
} from '../../transformer';
import {
  transformSyncByBabelRule,
  transformSyncBySwcRule,
} from '../../helpers';
import type { SyncTransformStep, TransformResult } from '../../types';
import { TransformPipeline } from '../TransformPipeline';
import { TransformPipelineBuilder } from '../TransformPipelineBuilder';

export class SyncTransformPipelineBuilder extends TransformPipelineBuilder<
  SyncTransformStep,
  SyncTransformPipeline
> {
  build(): SyncTransformPipeline {
    const pipeline = new SyncTransformPipeline(this.baseContext);

    this.beforeTransformStep && pipeline.addStep(this.beforeTransformStep);

    // 1. Inject initializeCore and specified scripts to entry file.
    if (this.injectScriptPaths.length) {
      pipeline.addStep((code, context) => {
        return {
          code: context.pluginData?.isEntryPoint
            ? this.combineInjectScripts(code, this.injectScriptPaths)
            : code,
          done: false,
        };
      });
    }

    // 2. Fully transform and skip other steps.
    const fullyTransformPackagesRegExp = this.getNodePackageRegExp(
      this.fullyTransformPackageNames,
    );
    if (fullyTransformPackagesRegExp) {
      pipeline.addStep((code, context) => {
        if (fullyTransformPackagesRegExp.test(context.path)) {
          return {
            code: transformSyncWithBabel(code, {
              context,
              preset: this.presets.babelFullyTransform,
            }),
            // skip other transformations when fully transformed
            done: true,
          };
        }
        return { code, done: false };
      });
    }

    // 3. Strip flow syntax.
    const stripFlowPackageNamesRegExp = this.getNodePackageRegExp(
      this.stripFlowPackageNames,
    );
    if (stripFlowPackageNamesRegExp) {
      pipeline.addStep((code, context) => {
        if (
          stripFlowPackageNamesRegExp.test(context.path) ||
          this.isFlow(code, context.path)
        ) {
          code = stripFlowWithSucrase(code, { context });
        }

        return { code, done: false };
      });
    }

    // 4. Apply additional babel rules.
    if (this.additionalBabelRules.length) {
      pipeline.addStep((code, context) => {
        for (const rule of this.additionalBabelRules) {
          code = transformSyncByBabelRule(rule, code, context) ?? code;
        }
        return { code, done: false };
      });
    }

    // 5. Apply additional swc rules.
    if (this.additionalSwcRules.length) {
      pipeline.addStep((code, context) => {
        for (const rule of this.additionalSwcRules) {
          code = transformSyncBySwcRule(rule, code, context) ?? code;
        }
        return { code, done: false };
      });
    }

    // 6. Transform code to es5.
    pipeline.addStep((code, context) => {
      return {
        code: transformSyncWithSwc(code, {
          context,
          preset: this.swcPreset,
        }),
        done: true,
      };
    });

    this.afterTransformStep && pipeline.addStep(this.afterTransformStep);

    return pipeline;
  }
}

export class SyncTransformPipeline extends TransformPipeline<SyncTransformStep> {
  public static builder = SyncTransformPipelineBuilder;
  protected steps: SyncTransformStep[] = [];

  addStep(runner: SyncTransformStep): this {
    this.steps.push(runner);
    return this;
  }

  transform(code: string, context: ScopedTransformContext): TransformResult {
    const transformContext = { ...this.baseContext, ...context };
    const transformResult = this.steps.reduce(
      (prev, curr) => (prev.done ? prev : curr(prev.code, transformContext)),
      { code, done: false } as TransformResult,
    );

    return transformResult;
  }
}

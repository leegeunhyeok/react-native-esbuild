import {
  transformWithBabel,
  transformWithSwc,
  stripFlowWithSucrase,
} from '../../transformer';
import { transformByBabelRule, transformBySwcRule } from '../../helpers';
import type {
  AsyncTransformStep,
  BaseTransformContext,
  TransformContext,
  TransformResult,
} from '../../types';
import { TransformPipeline } from '../TransformPipeline';
import { TransformPipelineBuilder } from '../TransformPipelineBuilder';

export class AsyncTransformPipelineBuilder extends TransformPipelineBuilder<
  AsyncTransformStep,
  AsyncTransformPipeline
> {
  build(): AsyncTransformPipeline {
    const pipeline = new AsyncTransformPipeline(this.baseContext);

    this.beforeTransformStep && pipeline.addStep(this.beforeTransformStep);

    // 1. Inject initializeCore and specified scripts to entry file.
    if (this.injectScriptPaths.length) {
      pipeline.addStep((code, context) => {
        return Promise.resolve({
          code: context.pluginData?.isEntryPoint
            ? this.combineInjectScripts(code, this.injectScriptPaths)
            : code,
          done: false,
        });
      });
    }

    // 2. Fully transform and skip other steps.
    const fullyTransformPackagesRegExp = this.getNodePackageRegExp(
      this.fullyTransformPackageNames,
    );
    if (fullyTransformPackagesRegExp) {
      pipeline.addStep(async (code, context) => {
        if (fullyTransformPackagesRegExp.test(context.path)) {
          return {
            code: await transformWithBabel(code, {
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

        return Promise.resolve({ code, done: false });
      });
    }

    // 4. Apply additional babel rules.
    if (this.additionalBabelRules.length) {
      pipeline.addStep(async (code, context) => {
        for await (const rule of this.additionalBabelRules) {
          code = (await transformByBabelRule(rule, code, context)) ?? code;
        }
        return { code, done: false };
      });
    }

    // 5. Apply additional swc rules.
    if (this.additionalSwcRules.length) {
      pipeline.addStep(async (code, context) => {
        for await (const rule of this.additionalSwcRules) {
          code = (await transformBySwcRule(rule, code, context)) ?? code;
        }
        return { code, done: false };
      });
    }

    // 6. Transform code to es5.
    pipeline.addStep(async (code, context) => {
      return {
        code: await transformWithSwc(code, {
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

export class AsyncTransformPipeline extends TransformPipeline<AsyncTransformStep> {
  public static builder = AsyncTransformPipelineBuilder;
  protected steps: AsyncTransformStep[] = [];

  async transform(
    code: string,
    context: Omit<TransformContext, keyof BaseTransformContext>,
  ): Promise<TransformResult> {
    const transformContext = { ...this.baseContext, ...context };
    const transformResult = await this.steps.reduce(
      (prev, curr) => {
        return prev.then((result) =>
          result.done ? result : curr(result.code, transformContext),
        );
      },
      Promise.resolve({ code, done: false } as TransformResult),
    );

    return transformResult;
  }
}

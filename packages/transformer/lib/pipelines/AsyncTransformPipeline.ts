import path from 'node:path';
import type { OnLoadArgs } from 'esbuild';
import {
  transformWithBabel,
  transformWithSwc,
  stripFlowWithSucrase,
} from '../transformer';
import { transformByBabelRule, transformBySwcRule } from '../helpers';
import type { AsyncTransformStep, TransformResult, SharedData } from '../types';
import { TransformPipeline } from './pipeline';
import { TransformPipelineBuilder } from './builder';

export class AsyncTransformPipelineBuilder extends TransformPipelineBuilder<
  AsyncTransformStep,
  AsyncTransformPipeline
> {
  build(): AsyncTransformPipeline {
    const pipeline = new AsyncTransformPipeline();

    this.onBefore && pipeline.beforeTransform(this.onBefore);
    this.onAfter && pipeline.afterTransform(this.onAfter);

    // 1. Inject initializeCore and specified scripts to entry file.
    if (this.injectScriptPaths.length) {
      const entryFile = path.resolve(this.root, this.entry);
      pipeline.addStep((code, args) => {
        return Promise.resolve({
          code:
            args.path === entryFile
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
      pipeline.addStep(async (code, args) => {
        if (fullyTransformPackagesRegExp.test(args.path)) {
          return {
            code: await transformWithBabel(
              code,
              this.getTransformContext(args),
              { fullyTransform: true },
            ),
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
      pipeline.addStep((code, args) => {
        if (
          stripFlowPackageNamesRegExp.test(args.path) ||
          this.isFlow(code, args.path)
        ) {
          // eslint-disable-next-line no-param-reassign -- Allow reassign.
          code = stripFlowWithSucrase(code, this.getTransformContext(args));
        }

        return Promise.resolve({ code, done: false });
      });
    }

    // 4. Apply additional babel rules.
    if (this.additionalBabelRules.length) {
      pipeline.addStep(async (code, args) => {
        const context = this.getTransformContext(args);
        for await (const rule of this.additionalBabelRules) {
          // eslint-disable-next-line no-param-reassign -- Allow reassign.
          code = (await transformByBabelRule(rule, code, context)) ?? code;
        }
        return { code, done: false };
      });
    }

    // 5. Apply additional swc rules.
    if (this.additionalSwcRules.length) {
      pipeline.addStep(async (code, args) => {
        const context = this.getTransformContext(args);
        for await (const rule of this.additionalSwcRules) {
          // eslint-disable-next-line no-param-reassign -- Allow reassign.
          code = (await transformBySwcRule(rule, code, context)) ?? code;
        }
        return { code, done: false };
      });
    }

    // 6. Transform code to es5.
    pipeline.addStep(async (code, args) => {
      return {
        code: await transformWithSwc(code, this.getTransformContext(args)),
        done: true,
      };
    });

    return pipeline;
  }
}

export class AsyncTransformPipeline extends TransformPipeline<AsyncTransformStep> {
  public static builder = AsyncTransformPipelineBuilder;
  protected steps: AsyncTransformStep[] = [];
  protected onBeforeTransform?: AsyncTransformStep;
  protected onAfterTransform?: AsyncTransformStep;

  async transform(code: string, args: OnLoadArgs): Promise<TransformResult> {
    const sharedData = {} as SharedData;

    const before: AsyncTransformStep = (code, args) => {
      return this.onBeforeTransform
        ? this.onBeforeTransform(code, args, sharedData)
        : Promise.resolve({ code, done: false });
    };

    const after: AsyncTransformStep = (code, args) => {
      return this.onAfterTransform
        ? this.onAfterTransform(code, args, sharedData)
        : Promise.resolve({ code, done: true });
    };

    const result = await this.steps.reduce(
      (prev, curr) => {
        return Promise.resolve(prev).then((prevResult) =>
          prevResult.done
            ? Promise.resolve({ code: prevResult.code, done: true })
            : curr(prevResult.code, args, sharedData),
        );
      },
      before(code, args, sharedData),
    );

    const res = await after(result.code, args, sharedData);
    return res;
  }
}

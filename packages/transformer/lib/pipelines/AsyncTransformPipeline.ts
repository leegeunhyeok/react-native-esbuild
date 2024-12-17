import path from 'node:path';
import fs from 'node:fs/promises';
import type { OnLoadArgs } from 'esbuild';
import { parse as hermesParse } from 'hermes-parser';
import {
  transformWithBabel,
  transformWithSwc,
  stripFlowWithSucrase,
  transformWithBabelAst,
} from '../transformer';
import { transformByBabelRule, transformBySwcRule } from '../helpers';
import type { AsyncTransformStep, ModuleMeta, TransformResult } from '../types';
import { TransformPipeline } from './pipeline';
import { TransformPipelineBuilder } from './builder';

export class AsyncTransformPipelineBuilder extends TransformPipelineBuilder<
  AsyncTransformStep,
  AsyncTransformPipeline
> {
  build(): AsyncTransformPipeline {
    const pipeline = new AsyncTransformPipeline(this.context);

    this.onBefore && pipeline.beforeTransform(this.onBefore);
    this.onAfter && pipeline.afterTransform(this.onAfter);

    // 1. Inject initializeCore and specified scripts to entry file.
    if (this.injectScriptPaths.length) {
      const entryFile = path.resolve(this.context.root, this.context.entry);
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
              this.getContext(args),
              this.presets.babelFullyTransform,
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
      pipeline.addStep(async (code, args) => {
        if (
          stripFlowPackageNamesRegExp.test(args.path) ||
          this.isFlow(code, args.path)
        ) {
          const context = this.getContext(args);

          try {
            code = stripFlowWithSucrase(code, context);
          } catch {
            code = await transformWithBabelAst(
              hermesParse(code, { babel: true, flow: 'all' }),
              context,
            );
          }
        }

        return { code, done: false };
      });
    }

    // 4. Apply additional babel rules.
    if (this.additionalBabelRules.length) {
      pipeline.addStep(async (code, args) => {
        const context = this.getContext(args);
        for await (const rule of this.additionalBabelRules) {
          code = (await transformByBabelRule(rule, code, context)) ?? code;
        }
        return { code, done: false };
      });
    }

    // 5. Apply additional swc rules.
    if (this.additionalSwcRules.length) {
      pipeline.addStep(async (code, args) => {
        const context = this.getContext(args);
        for await (const rule of this.additionalSwcRules) {
          code = (await transformBySwcRule(rule, code, context)) ?? code;
        }
        return { code, done: false };
      });
    }

    // 6. Transform code to es5.
    pipeline.addStep(async (code, args) => {
      return {
        code: await transformWithSwc(
          code,
          this.getContext(args),
          this.swcPreset,
        ),
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
    const fileStat = await fs.stat(args.path);
    const moduleMeta: ModuleMeta = {
      stats: fileStat,
      hash: this.getHash(this.context.id, args.path, fileStat.mtimeMs),
    };

    const before: AsyncTransformStep = (code, args) => {
      return this.onBeforeTransform
        ? this.onBeforeTransform(code, args, moduleMeta)
        : Promise.resolve({ code, done: false });
    };

    const after: AsyncTransformStep = (code, args) => {
      return this.onAfterTransform
        ? this.onAfterTransform(code, args, moduleMeta)
        : Promise.resolve({ code, done: true });
    };

    const result = await this.steps.reduce(
      (prev, curr) => {
        return Promise.resolve(prev).then((prevResult) =>
          prevResult.done
            ? Promise.resolve({ code: prevResult.code, done: true })
            : curr(prevResult.code, args, moduleMeta),
        );
      },
      before(code, args, moduleMeta),
    );

    return after(result.code, args, moduleMeta);
  }
}

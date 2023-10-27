import path from 'node:path';
import fs from 'node:fs';
import type { OnLoadArgs } from 'esbuild';
import {
  transformSyncWithBabel,
  transformSyncWithSwc,
  stripFlowWithSucrase,
} from '../transformer';
import { transformSyncByBabelRule, transformSyncBySwcRule } from '../helpers';
import type { SyncTransformStep, TransformResult, ModuleMeta } from '../types';
import { TransformPipeline } from './pipeline';
import { TransformPipelineBuilder } from './builder';

export class SyncTransformPipelineBuilder extends TransformPipelineBuilder<
  SyncTransformStep,
  SyncTransformPipeline
> {
  build(): SyncTransformPipeline {
    const pipeline = new SyncTransformPipeline(this.context);

    this.onBefore && pipeline.beforeTransform(this.onBefore);
    this.onAfter && pipeline.afterTransform(this.onAfter);

    // 1. Inject initializeCore and specified scripts to entry file.
    if (this.injectScriptPaths.length) {
      const entryFile = path.resolve(this.context.root, this.context.entry);
      pipeline.addStep((code, args) => {
        return {
          code:
            args.path === entryFile
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
      pipeline.addStep((code, args) => {
        if (fullyTransformPackagesRegExp.test(args.path)) {
          return {
            code: transformSyncWithBabel(
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
      pipeline.addStep((code, args) => {
        if (
          stripFlowPackageNamesRegExp.test(args.path) ||
          this.isFlow(code, args.path)
        ) {
          // eslint-disable-next-line no-param-reassign -- Allow reassign.
          code = stripFlowWithSucrase(code, this.getContext(args));
        }

        return { code, done: false };
      });
    }

    // 4. Apply additional babel rules.
    if (this.additionalBabelRules.length) {
      pipeline.addStep((code, args) => {
        const context = this.getContext(args);
        for (const rule of this.additionalBabelRules) {
          // eslint-disable-next-line no-param-reassign -- Allow reassign.
          code = transformSyncByBabelRule(rule, code, context) ?? code;
        }
        return { code, done: false };
      });
    }

    // 5. Apply additional swc rules.
    if (this.additionalSwcRules.length) {
      pipeline.addStep((code, args) => {
        const context = this.getContext(args);
        for (const rule of this.additionalSwcRules) {
          // eslint-disable-next-line no-param-reassign -- Allow reassign.
          code = transformSyncBySwcRule(rule, code, context) ?? code;
        }
        return { code, done: false };
      });
    }

    // 6. Transform code to es5.
    pipeline.addStep((code, args) => {
      return {
        code: transformSyncWithSwc(code, this.getContext(args), this.swcPreset),
        done: true,
      };
    });

    return pipeline;
  }
}

export class SyncTransformPipeline extends TransformPipeline<SyncTransformStep> {
  public static builder = SyncTransformPipelineBuilder;
  protected steps: SyncTransformStep[] = [];
  protected onBeforeTransform?: SyncTransformStep;
  protected onAfterTransform?: SyncTransformStep;

  beforeTransform(onBeforeTransform: SyncTransformStep): this {
    this.onBeforeTransform = onBeforeTransform;
    return this;
  }

  afterTransform(onAfterTransform: SyncTransformStep): this {
    this.onAfterTransform = onAfterTransform;
    return this;
  }

  addStep(runner: SyncTransformStep): this {
    this.steps.push(runner);
    return this;
  }

  transform(code: string, args: OnLoadArgs): TransformResult {
    const fileStat = fs.statSync(args.path);
    const moduleMeta: ModuleMeta = {
      stats: fileStat,
      hash: this.getHash(this.context.id, args.path, fileStat.mtimeMs),
    };

    const before: SyncTransformStep = (code, args) => {
      return this.onBeforeTransform
        ? this.onBeforeTransform(code, args, moduleMeta)
        : { code, done: false };
    };

    const after: SyncTransformStep = (code, args) => {
      return this.onAfterTransform
        ? this.onAfterTransform(code, args, moduleMeta)
        : { code, done: true };
    };

    const result = this.steps.reduce(
      (prev, curr) => {
        return prev.done
          ? { code: prev.code, done: true }
          : curr(prev.code, args, moduleMeta);
      },
      before(code, args, moduleMeta),
    );

    return after(result.code, args, moduleMeta);
  }
}

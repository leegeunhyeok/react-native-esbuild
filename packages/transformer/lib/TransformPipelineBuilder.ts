import fs from 'node:fs/promises';
import path from 'node:path';
import type { OnLoadArgs } from 'esbuild';
import {
  transformWithBabel,
  stripFlowWithSucrase,
  transformWithSwc,
} from './transform';
import { transformByBabelRule, transformBySwcRule } from './helpers';
import type {
  TransformStep,
  BabelTransformRule,
  SwcTransformRule,
  SharedData,
} from './types';

class TransformPipelineBuilder {
  private onBefore?: TransformStep;
  private onAfter?: TransformStep;
  private injectScriptPaths: string[] = [];
  private fullyTransformPackageNames: string[] = [];
  private stripFlowPackageNames: string[] = [];
  private additionalBabelRules: BabelTransformRule[] = [];
  private additionalSwcRules: SwcTransformRule[] = [];

  constructor(
    private root: string,
    private entry: string,
  ) {}

  private getNodePackageRegExp(packageNames: string[]): RegExp | null {
    return packageNames.length
      ? new RegExp(`node_modules/(?:${packageNames.join('|')})/`)
      : null;
  }

  private getTransformContext(args: OnLoadArgs): {
    path: string;
    root: string;
  } {
    return { path: args.path, root: this.root };
  }

  onStart(transformer: TransformStep): this {
    this.onBefore = transformer;
    return this;
  }

  onEnd(transformer: TransformStep): this {
    this.onAfter = transformer;
    return this;
  }

  setInjectScripts(injectScriptPaths: string[]): this {
    this.injectScriptPaths = injectScriptPaths;
    return this;
  }

  setFullyTransformPackages(packageNames: string[]): this {
    this.fullyTransformPackageNames = packageNames;
    return this;
  }

  setStripFlowPackages(packageNames: string[]): this {
    this.stripFlowPackageNames = packageNames;
    return this;
  }

  setAdditionalBabelTransformRules(rules: BabelTransformRule[]): this {
    this.additionalBabelRules = rules;
    return this;
  }

  setAdditionalSwcTransformRules(rules: SwcTransformRule[]): this {
    this.additionalSwcRules = rules;
    return this;
  }

  build(): TransformPipeline {
    const pipeline = new TransformPipeline();

    this.onBefore && pipeline.beforeTransform(this.onBefore);
    this.onAfter && pipeline.afterTransform(this.onAfter);

    // 1. Inject initializeCore and specified scripts to entry file.
    if (this.injectScriptPaths.length) {
      const entryFile = path.resolve(this.root, this.entry);
      const combineInjectScripts = (
        code: string,
        injectScriptPaths: string[],
      ): string => {
        return [
          ...injectScriptPaths.map((modulePath) => `import '${modulePath}';`),
          code,
        ].join('\n');
      };

      pipeline.addStep((code, args) => {
        return {
          code:
            args.path === entryFile
              ? combineInjectScripts(code, this.injectScriptPaths)
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
      const isFlow = (source: string, path: string): boolean => {
        return (
          path.endsWith('.js') &&
          ['@flow', '@noflow'].some((flowSyntaxToken) =>
            source.includes(flowSyntaxToken),
          )
        );
      };

      pipeline.addStep(async (code, args) => {
        if (
          stripFlowPackageNamesRegExp.test(args.path) ||
          isFlow(code, args.path)
        ) {
          // eslint-disable-next-line no-param-reassign -- Allow reassign.
          code = await stripFlowWithSucrase(
            code,
            this.getTransformContext(args),
          );
        }

        return { code, done: false };
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

export class TransformPipeline {
  public static builder = TransformPipelineBuilder;
  private steps: TransformStep[] = [];
  private onBeforeTransform?: TransformStep;
  private onAfterTransform?: TransformStep;

  beforeTransform(onBeforeTransform: TransformStep): this {
    this.onBeforeTransform = onBeforeTransform;
    return this;
  }

  afterTransform(onAfterTransform: TransformStep): this {
    this.onAfterTransform = onAfterTransform;
    return this;
  }

  addStep(runner: TransformStep): this {
    this.steps.push(runner);
    return this;
  }

  async transform(args: OnLoadArgs): Promise<string> {
    const rawCode = await fs.readFile(args.path, { encoding: 'utf-8' });
    const sharedData = {} as SharedData;

    const before: TransformStep = (code, args) => {
      return this.onBeforeTransform
        ? this.onBeforeTransform(code, args, sharedData)
        : Promise.resolve({ code, done: false });
    };

    const after: TransformStep = (code, args) => {
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
      before(rawCode, args, sharedData),
    );

    return (await after(result.code, args, sharedData)).code;
  }
}

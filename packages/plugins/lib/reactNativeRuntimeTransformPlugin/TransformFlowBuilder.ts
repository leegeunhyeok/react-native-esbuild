import fs from 'node:fs/promises';
import path from 'node:path';
import {
  transformWithBabel,
  stripFlowWithSucrase,
  transformWithSwc,
} from '@react-native-esbuild/transformer';
import type {
  PluginContext,
  BabelTransformRule,
  SwcTransformRule,
} from '@react-native-esbuild/core';
import type { OnLoadArgs } from 'esbuild';

export class TransformFlowBuilder {
  private onBefore?: FlowRunner;
  private onAfter?: FlowRunner;
  private injectScriptPaths: string[] = [];
  private fullyTransformPackageNames: string[] = [];
  private stripFlowPackageNames: string[] = [];
  private additionalBabelRules: BabelTransformRule[] = [];
  private additionalSwcRules: SwcTransformRule[] = [];

  constructor(private context: PluginContext) {}

  private getNodePackageRegExp(packageNames: string[]): RegExp | null {
    return packageNames.length
      ? new RegExp(`node_modules/(?:${packageNames.join('|')})/`)
      : null;
  }

  private getTransformContext(args: OnLoadArgs): {
    path: string;
    root: string;
  } {
    return { path: args.path, root: this.context.root };
  }

  onStart(transformer: FlowRunner): this {
    this.onBefore = transformer;
    return this;
  }

  onEnd(transformer: FlowRunner): this {
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

  build(): TransformFlow {
    const transformFlow = new TransformFlow();

    this.onBefore && transformFlow.beforeTransform(this.onBefore);
    this.onAfter && transformFlow.afterTransform(this.onAfter);

    // 1. inject initializeCore and specified scripts to entry file
    if (this.injectScriptPaths.length) {
      const entryFile = path.resolve(this.context.root, this.context.entry);
      const combineInjectScripts = (
        code: string,
        injectScriptPaths: string[],
      ): string => {
        return [
          injectScriptPaths.map((modulePath) => `import '${modulePath}';`),
          code,
        ].join('\n');
      };

      // eslint-disable-next-line @typescript-eslint/require-await -- allow
      transformFlow.addFlow(async (code, args) => {
        return {
          code:
            args.path === entryFile
              ? combineInjectScripts(code, this.injectScriptPaths)
              : code,
          done: false,
        };
      });
    }

    // 2. fully transform and skip other flows
    const fullyTransformPackagesRegExp = this.getNodePackageRegExp(
      this.fullyTransformPackageNames,
    );
    if (fullyTransformPackagesRegExp) {
      transformFlow.addFlow(async (code, args) => {
        if (fullyTransformPackagesRegExp.test(args.path)) {
          return {
            code: await transformWithBabel(
              code,
              this.getTransformContext(args),
              {
                // follow babelrc of react-native project's root (same as metro)
                babelrc: true,
              },
            ),
            // skip other transformations when fully transformed
            done: true,
          };
        }
        return { code, done: false };
      });
    }

    // 3. strip flow syntax
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

      transformFlow.addFlow(async (code, args) => {
        if (
          stripFlowPackageNamesRegExp.test(args.path) ||
          isFlow(code, args.path)
        ) {
          // eslint-disable-next-line no-param-reassign -- allow
          code = await stripFlowWithSucrase(
            code,
            this.getTransformContext(args),
          );
        }

        return { code, done: false };
      });
    }

    // 4. apply additional babel rules
    if (this.additionalBabelRules.length) {
      transformFlow.addFlow(async (code, args) => {
        for await (const rule of this.additionalBabelRules) {
          if (rule.test(args.path, code)) {
            // eslint-disable-next-line no-param-reassign -- allow
            code = await transformWithBabel(
              code,
              this.getTransformContext(args),
              typeof rule.options === 'function'
                ? rule.options(args.path, code)
                : rule.options,
            );
          }
        }
        return { code, done: false };
      });
    }

    // 5. apply additional swc rules
    if (this.additionalSwcRules.length) {
      transformFlow.addFlow(async (code, args) => {
        for await (const rule of this.additionalSwcRules) {
          if (rule.test(args.path, code)) {
            // eslint-disable-next-line no-param-reassign -- allow
            code = await transformWithSwc(
              code,
              this.getTransformContext(args),
              typeof rule.options === 'function'
                ? rule.options(args.path, code)
                : rule.options,
            );
          }
        }
        return { code, done: false };
      });
    }

    // 6. transform to es5 (end of transform flow)
    transformFlow.addFlow(async (code, args) => {
      return {
        code: await transformWithSwc(code, this.getTransformContext(args)),
        done: true,
      };
    });

    return transformFlow;
  }
}

export class TransformFlow {
  private flow: FlowRunner[] = [];
  private onBeforeTransform?: FlowRunner;
  private onAfterTransform?: FlowRunner;

  beforeTransform(onBeforeTransform: FlowRunner): this {
    this.onBeforeTransform = onBeforeTransform;
    return this;
  }

  afterTransform(onAfterTransform: FlowRunner): this {
    this.onAfterTransform = onAfterTransform;
    return this;
  }

  addFlow(runner: FlowRunner): this {
    this.flow.push(runner);
    return this;
  }

  async transform(args: OnLoadArgs): Promise<string> {
    const rawCode = await fs.readFile(args.path, { encoding: 'utf-8' });
    const sharedData = {} as FlowSharedData;

    const before: FlowRunner = (code, args) => {
      return this.onBeforeTransform
        ? this.onBeforeTransform(code, args, sharedData)
        : Promise.resolve({ code, done: false });
    };

    const after: FlowRunner = (code, args) => {
      return this.onAfterTransform
        ? this.onAfterTransform(code, args, sharedData)
        : Promise.resolve({ code, done: true });
    };

    const result = await this.flow.reduce(
      (prev, curr) => {
        return prev.then((prevResult) =>
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

export type FlowRunner = (
  code: string,
  args: OnLoadArgs,
  sharedData: FlowSharedData,
) => Promise<TransformResult>;

interface TransformResult {
  code: string;
  done: boolean;
}

interface FlowSharedData {
  hash?: string;
  mtimeMs?: number;
}

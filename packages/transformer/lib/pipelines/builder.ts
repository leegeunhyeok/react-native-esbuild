import type { OnLoadArgs } from 'esbuild';
import type { Options as SwcTransformOptions } from '@swc/core';
import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type {
  BabelTransformRule,
  SwcTransformRule,
  TransformStep,
} from '../types';
import { babelPresets, swcPresets } from '../transformer';
import type { TransformPipeline } from './pipeline';

const FLOW_SYMBOL = ['@flow', '@noflow'] as const;

export abstract class TransformPipelineBuilder<
  Step extends TransformStep<unknown>,
  Pipeline extends TransformPipeline<Step>,
> {
  protected onBefore?: Step;
  protected onAfter?: Step;
  protected transformerOptions: {
    swc?: SwcTransformOptions;
    babel?: BabelTransformOptions;
  } = {};
  protected injectScriptPaths: string[] = [];
  protected fullyTransformPackageNames: string[] = [];
  protected stripFlowPackageNames: string[] = [];
  protected additionalBabelRules: BabelTransformRule[] = [];
  protected additionalSwcRules: SwcTransformRule[] = [];

  constructor(
    protected root: string,
    protected entry: string,
    transformerOptions?: {
      swc?: SwcTransformOptions;
      babel?: BabelTransformOptions;
    },
  ) {
    this.transformerOptions.swc =
      transformerOptions?.swc ?? swcPresets.getReactNativeRuntimeOptions();
    this.transformerOptions.babel =
      transformerOptions?.babel ?? babelPresets.getCommon();
  }

  protected getNodePackageRegExp(packageNames: string[]): RegExp | null {
    return packageNames.length
      ? new RegExp(`node_modules/(?:${packageNames.join('|')})/`)
      : null;
  }

  protected getTransformContext(args: OnLoadArgs): {
    path: string;
    root: string;
  } {
    return { path: args.path, root: this.root };
  }

  protected combineInjectScripts(
    code: string,
    injectScriptPaths: string[],
  ): string {
    return [
      ...injectScriptPaths.map((modulePath) => `import '${modulePath}';`),
      code,
    ].join('\n');
  }

  protected isFlow(source: string, path: string): boolean {
    return (
      path.endsWith('.js') &&
      FLOW_SYMBOL.some((flowSyntaxToken) => source.includes(flowSyntaxToken))
    );
  }

  public onStart(transformer: Step): this {
    this.onBefore = transformer;
    return this;
  }

  public onEnd(transformer: Step): this {
    this.onAfter = transformer;
    return this;
  }

  public setInjectScripts(injectScriptPaths: string[]): this {
    this.injectScriptPaths = injectScriptPaths;
    return this;
  }

  public setFullyTransformPackages(packageNames: string[]): this {
    this.fullyTransformPackageNames = packageNames;
    return this;
  }

  public setStripFlowPackages(packageNames: string[]): this {
    this.stripFlowPackageNames = packageNames;
    return this;
  }

  public setAdditionalBabelTransformRules(rules: BabelTransformRule[]): this {
    this.additionalBabelRules = rules;
    return this;
  }

  public setAdditionalSwcTransformRules(rules: SwcTransformRule[]): this {
    this.additionalSwcRules = rules;
    return this;
  }

  abstract build(): Pipeline;
}

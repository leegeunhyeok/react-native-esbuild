import type { OnLoadArgs } from 'esbuild';
import type { Options as SwcTransformOptions } from '@swc/core';
import type {
  BabelTransformRule,
  SwcTransformRule,
  TransformStep,
  TransformerOptionsPreset,
} from '../types';
import { babelPresets } from '../transformer';
import type { TransformPipeline } from './pipeline';

const FLOW_SYMBOL = ['@flow', '@noflow'] as const;

export abstract class TransformPipelineBuilder<
  Step extends TransformStep<unknown>,
  Pipeline extends TransformPipeline<Step>,
> {
  protected presets = {
    babelFullyTransform: babelPresets.getFullyTransformPreset(),
  };
  protected onBefore?: Step;
  protected onAfter?: Step;
  protected swcPreset?: TransformerOptionsPreset<SwcTransformOptions>;
  protected injectScriptPaths: string[] = [];
  protected fullyTransformPackageNames: string[] = [];
  protected stripFlowPackageNames: string[] = [];
  protected additionalBabelRules: BabelTransformRule[] = [];
  protected additionalSwcRules: SwcTransformRule[] = [];

  constructor(
    protected root: string,
    protected entry: string,
  ) {}

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

  public setSwcPreset(
    preset: TransformerOptionsPreset<SwcTransformOptions>,
  ): this {
    this.swcPreset = preset;
    return this;
  }

  abstract build(): Pipeline;
}

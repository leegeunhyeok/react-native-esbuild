import {
  transformWithBabel,
  transformSyncWithBabel,
  transformWithSwc,
  transformSyncWithSwc,
} from '../transformer';
import type {
  TransformRuleBase,
  TransformerContext,
  SwcTransformRule,
  BabelTransformRule,
  TransformerOptionsPreset,
} from '../types';

const ruleOptionsToPreset = <T>(
  options: TransformRuleBase<T>['options'],
  code: string,
): TransformerOptionsPreset<T> => {
  return options instanceof Function
    ? (context) => options(context.path, code)
    : () => options;
};

export const transformByBabelRule = (
  rule: BabelTransformRule,
  code: string,
  context: TransformerContext,
): Promise<string | null> => {
  return rule.test(context.path, code)
    ? transformWithBabel(code, context, ruleOptionsToPreset(rule.options, code))
    : Promise.resolve(null);
};

export const transformSyncByBabelRule = (
  rule: BabelTransformRule,
  code: string,
  context: TransformerContext,
): string | null => {
  return rule.test(context.path, code)
    ? transformSyncWithBabel(
        code,
        context,
        ruleOptionsToPreset(rule.options, code),
      )
    : null;
};

export const transformBySwcRule = (
  rule: SwcTransformRule,
  code: string,
  context: TransformerContext,
): Promise<string | null> => {
  return rule.test(context.path, code)
    ? transformWithSwc(code, context, ruleOptionsToPreset(rule.options, code))
    : Promise.resolve(null);
};

export const transformSyncBySwcRule = (
  rule: SwcTransformRule,
  code: string,
  context: TransformerContext,
): string | null => {
  return rule.test(context.path, code)
    ? transformSyncWithSwc(
        code,
        context,
        ruleOptionsToPreset(rule.options, code),
      )
    : null;
};

import type {
  BabelTransformRule,
  SwcTransformRule,
  TransformContext,
  TransformRuleBase,
} from '@react-native-esbuild/shared';
import {
  transformWithBabel,
  transformSyncWithBabel,
  transformWithSwc,
  transformSyncWithSwc,
} from '../transformer';
import type { TransformerOptionsPreset } from '../types';

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
  context: TransformContext,
): Promise<string | null> => {
  return rule.test(context.path, code)
    ? transformWithBabel(code, {
        context,
        preset: ruleOptionsToPreset(rule.options, code),
      })
    : Promise.resolve(null);
};

export const transformSyncByBabelRule = (
  rule: BabelTransformRule,
  code: string,
  context: TransformContext,
): string | null => {
  return rule.test(context.path, code)
    ? transformSyncWithBabel(code, {
        context,
        preset: ruleOptionsToPreset(rule.options, code),
      })
    : null;
};

export const transformBySwcRule = (
  rule: SwcTransformRule,
  code: string,
  context: TransformContext,
): Promise<string | null> => {
  return rule.test(context.path, code)
    ? transformWithSwc(code, {
        context,
        preset: ruleOptionsToPreset(rule.options, code),
      })
    : Promise.resolve(null);
};

export const transformSyncBySwcRule = (
  rule: SwcTransformRule,
  code: string,
  context: TransformContext,
): string | null => {
  return rule.test(context.path, code)
    ? transformSyncWithSwc(code, {
        context,
        preset: ruleOptionsToPreset(rule.options, code),
      })
    : null;
};

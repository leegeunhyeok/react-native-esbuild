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
} from '../types';

const getOptions = <T>(
  options: TransformRuleBase<T>['options'],
  code: string,
  context: TransformerContext,
): T => {
  return options instanceof Function ? options(context.path, code) : options;
};

export const transformByBabelRule = (
  rule: BabelTransformRule,
  code: string,
  context: TransformerContext,
): Promise<string | null> => {
  return rule.test(context.path, code)
    ? transformWithBabel(code, context, {
        overrideOptions: getOptions(rule.options, code, context),
      })
    : Promise.resolve(null);
};

export const transformSyncByBabelRule = (
  rule: BabelTransformRule,
  code: string,
  context: TransformerContext,
): string | null => {
  return rule.test(context.path, code)
    ? transformSyncWithBabel(code, context, {
        overrideOptions: getOptions(rule.options, code, context),
      })
    : null;
};

export const transformBySwcRule = (
  rule: SwcTransformRule,
  code: string,
  context: TransformerContext,
): Promise<string | null> => {
  return rule.test(context.path, code)
    ? transformWithSwc(code, context, {
        overrideOptions: getOptions(rule.options, code, context),
      })
    : Promise.resolve(null);
};

export const transformSyncBySwcRule = (
  rule: SwcTransformRule,
  code: string,
  context: TransformerContext,
): string | null => {
  return rule.test(context.path, code)
    ? transformSyncWithSwc(code, context, {
        overrideOptions: getOptions(rule.options, code, context),
      })
    : null;
};

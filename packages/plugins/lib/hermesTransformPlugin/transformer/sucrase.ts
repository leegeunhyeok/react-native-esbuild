import { transform } from 'sucrase';
import type { Transformer } from '../../types';

export const stripFlowWithSucrase: Transformer<void> = (code, context) => {
  return transform(code, {
    transforms: ['flow', 'imports', 'jsx'],
    filePath: context.args.path,
  }).code;
};

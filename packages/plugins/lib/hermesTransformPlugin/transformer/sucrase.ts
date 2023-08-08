import { transform } from 'sucrase';
import type { OnLoadArgs } from 'esbuild';

export const stripFlowWithSucrase = (
  source: string,
  args: OnLoadArgs,
): string => {
  return transform(source, {
    transforms: ['flow', 'imports', 'jsx'],
    filePath: args.path,
  }).code;
};

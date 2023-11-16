import { transform, type Transform } from 'sucrase';
import type { SyncTransformer } from '../../types';

const TRANSFORM_FOR_STRIP_FLOW: Transform[] = ['flow', 'jsx'];

const stripFlowTypeofImportStatements = (code: string): string => {
  return code
    .split('\n')
    .filter((line) => !line.startsWith('import typeof '))
    .join('\n');
};

export const stripFlowWithSucrase: SyncTransformer<void> = (code, context) => {
  return stripFlowTypeofImportStatements(
    transform(code, {
      transforms: TRANSFORM_FOR_STRIP_FLOW,
      filePath: context.path,
    }).code,
  );
};

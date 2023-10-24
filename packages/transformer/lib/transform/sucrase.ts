import { transform, type Transform } from 'sucrase';
import type { SyncTransformer } from '../types';

const TRANSFORM_FOR_STRIP_FLOW: Transform[] = ['flow', 'imports', 'jsx'];

export const stripFlowWithSucrase: SyncTransformer<void> = (code, context) => {
  return transform(code, {
    transforms: TRANSFORM_FOR_STRIP_FLOW,
    filePath: context.path,
  }).code;
};

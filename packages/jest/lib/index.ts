import type { TransformerFactory } from '@jest/transform';
import { createTransformer } from './transformer';

const factory: TransformerFactory<ReturnType<typeof createTransformer>> = {
  createTransformer,
};

export default factory;

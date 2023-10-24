import type { SwcJestPresetOptions } from '@react-native-esbuild/transformer';

export type TransformerConfig = Omit<SwcJestPresetOptions, 'module'>;

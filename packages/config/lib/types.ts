import type { Platform } from '@react-native-esbuild/core';

export interface EsbuildPresetOptions {
  platform: Platform;
  dev: boolean;
}

export interface SWCPresetOptions {
  filename: string;
}

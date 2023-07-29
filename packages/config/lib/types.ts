export interface EsbuildPresetOptions {
  platform: 'android' | 'ios' | 'web';
  dev: boolean;
}

export interface SwcPresetOptions {
  filename: string;
}

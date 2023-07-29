export interface EsbuildPresetOptions {
  platform: 'android' | 'ios' | 'web';
  dev: boolean;
  outfile: string;
}

export interface SwcPresetOptions {
  filename: string;
}

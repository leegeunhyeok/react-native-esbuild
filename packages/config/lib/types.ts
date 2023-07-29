export interface EsbuildPresetOptions {
  entryPoints: string[];
  outfile: string;
  platform: 'android' | 'ios' | 'web';
  dev: boolean;
}

export interface SwcPresetOptions {
  filename: string;
}

export interface EsbuildPresetOptions {
  entryPoint: string;
  outfile: string;
  assetsDir: string;
  platform: 'android' | 'ios' | 'web';
  dev: boolean;
  minify: boolean;
}

export interface SwcPresetOptions {
  filename: string;
}

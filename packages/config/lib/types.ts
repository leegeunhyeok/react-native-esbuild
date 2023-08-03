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

export interface CustomBabelTransformOption {
  testSource?: string | RegExp;
  testPath?: string | RegExp;
  plugins: string[];
}

export interface CoreConfig {
  cache: boolean;
  transform: {
    fullyTransformPackageNames?: string[];
  };
}

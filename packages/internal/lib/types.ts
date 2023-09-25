import type { BundlerSupportPlatform } from '@react-native-esbuild/config';

export interface Asset {
  // `/path/to/asset/image.png`
  path: string;
  // `image.png`
  basename: string;
  // `image`
  name: string;
  // `.png`
  extension: string;
  // `png`
  type: string;
  // [1, 2, 3]
  scales: number[];
  httpServerLocation: string;
  hash: string;
  dimensions: { width: number; height: number };
  platform: BundlerSupportPlatform | null;
}

export type AssetScale = 1 | 2 | 3;

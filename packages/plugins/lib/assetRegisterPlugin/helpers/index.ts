import type { Asset } from '../../types';

// @TODO: move to internal package
/**
 * get asset registration script
 *
 * @see {@link https://github.com/facebook/metro/blob/v0.78.0/packages/metro/src/Bundler/util.js#L29-L57}
 * @see {@link https://github.com/facebook/react-native/blob/v0.72.0/packages/react-native/Libraries/Image/RelativeImageStub.js}
 */
export const getAssetRegistrationScript = ({
  name,
  type,
  scales,
  hash,
  httpServerLocation,
  dimensions,
}: Pick<
  Asset,
  'name' | 'type' | 'scales' | 'hash' | 'httpServerLocation' | 'dimensions'
>): string => {
  return `
    module.exports = require('react-native/Libraries/Image/AssetRegistry').registerAsset(${JSON.stringify(
      {
        __packager_asset: true,
        name,
        type,
        scales,
        hash,
        httpServerLocation,
        width: dimensions.width,
        height: dimensions.height,
      },
    )});
  `;
};

export * from './fs';
export * from './path';

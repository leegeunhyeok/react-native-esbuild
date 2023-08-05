import { bitwiseOptions } from '../core';
import { getDevServerAssetPath } from '../server';
import { OptionFlag } from '../../types';
import type { BitwiseOptions } from '../../types';

describe('getDevServerAssetPath', () => {
  it('should match snapshot', () => {
    expect(getDevServerAssetPath()).toMatchSnapshot();
  });
});

describe.each([
  [
    { platform: 'android', dev: false, minify: false },
    OptionFlag.PlatformAndroid,
  ],
  [
    { platform: 'android', dev: true, minify: false },
    OptionFlag.PlatformAndroid | OptionFlag.Dev,
  ],
  [
    { platform: 'android', dev: false, minify: true },
    OptionFlag.PlatformAndroid | OptionFlag.Minify,
  ],
  [
    { platform: 'android', dev: true, minify: true },
    OptionFlag.PlatformAndroid | OptionFlag.Dev | OptionFlag.Minify,
  ],
  [{ platform: 'ios', dev: false, minify: false }, OptionFlag.PlatformIos],
  [
    { platform: 'ios', dev: true, minify: false },
    OptionFlag.PlatformIos | OptionFlag.Dev,
  ],
  [
    { platform: 'ios', dev: false, minify: true },
    OptionFlag.PlatformIos | OptionFlag.Minify,
  ],
  [
    { platform: 'ios', dev: true, minify: true },
    OptionFlag.PlatformIos | OptionFlag.Dev | OptionFlag.Minify,
  ],
  [{ platform: 'web', dev: false, minify: false }, OptionFlag.PlatformWeb],
  [
    { platform: 'web', dev: true, minify: false },
    OptionFlag.PlatformWeb | OptionFlag.Dev,
  ],
  [
    { platform: 'web', dev: false, minify: true },
    OptionFlag.PlatformWeb | OptionFlag.Minify,
  ],
  [
    { platform: 'web', dev: true, minify: true },
    OptionFlag.PlatformWeb | OptionFlag.Dev | OptionFlag.Minify,
  ],
])('bitwiseOptions', (options, expected) => {
  const dev = options.dev ? 'true' : 'false';
  const minify = options.minify ? 'true' : 'false';

  describe(`platform: ${options.platform}, dev: ${dev}, minify: ${minify}`, () => {
    it(`should bitwise value is ${expected}`, () => {
      expect(bitwiseOptions(options as BitwiseOptions)).toEqual(expected);
    });
  });
});

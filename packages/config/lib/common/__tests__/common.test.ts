import { getIdByOptions, getBuildStatusCachePath } from '../core';
import { OptionFlag } from '../../types';

const BASE_OPTIONS = {
  outfile: '',
  entry: '',
  metafile: false,
} as const;

const ROOT_DIR = '/root';

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
] as const)('getIdByOptions', (options, expected) => {
  const dev = options.dev ? 'true' : 'false';
  const minify = options.minify ? 'true' : 'false';

  describe(`platform: ${options.platform}, dev: ${dev}, minify: ${minify}`, () => {
    it(`should bitwise value is ${expected}`, () => {
      expect(getIdByOptions({ ...BASE_OPTIONS, ...options })).toEqual(expected);
    });
  });
});

describe('getBuildStatusCachePath', () => {
  it('should match snapshot', () => {
    expect(getBuildStatusCachePath(ROOT_DIR)).toMatchSnapshot();
  });
});

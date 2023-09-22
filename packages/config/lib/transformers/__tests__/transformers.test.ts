import { getEsbuildOptions } from '../esbuild';
import { getSwcOptions } from '../swc';
import { getBabelOptions } from '../babel';

describe('getEsbuildOptions', () => {
  it('should match snapshot', () => {
    expect(
      getEsbuildOptions({
        platform: 'android',
        entry: 'index.js',
        outfile: 'main.bundlejs',
        dev: true,
        minify: false,
        metafile: false,
        assetsDir: 'assets',
      }),
    ).toMatchSnapshot();
  });
});

describe('getSwcOptions', () => {
  it('should match snapshot', () => {
    expect(
      getSwcOptions({ filename: 'file.js', root: '/root' }),
    ).toMatchSnapshot();
  });

  describe('when filename ends with `.js`', () => {
    it('should set parse syntax to `ecmascript`', () => {
      const options = getSwcOptions({ filename: 'file.js', root: '/root' });
      expect(options.jsc?.parser?.syntax).toEqual('ecmascript');
    });
  });

  describe('when filename ends with `.jsx`', () => {
    it('should set parse syntax to `ecmascript`', () => {
      const options = getSwcOptions({ filename: 'file.jsx', root: '/root' });
      expect(options.jsc?.parser?.syntax).toEqual('ecmascript');
    });
  });

  describe('when filename ends with `.ts`', () => {
    it('should set parse syntax to `typescript`', () => {
      const options = getSwcOptions({ filename: 'file.ts', root: '/root' });
      expect(options.jsc?.parser?.syntax).toEqual('typescript');
    });
  });

  describe('when filename ends with `.tsx`', () => {
    it('should set parse syntax to `typescript`', () => {
      const options = getSwcOptions({ filename: 'file.tsx', root: '/root' });
      expect(options.jsc?.parser?.syntax).toEqual('typescript');
    });
  });

  describe('when customSwcOptions present', () => {
    it('should override default options', () => {
      const overrideOptions = {
        isModule: false,
        jsc: {
          parser: undefined,
          loose: false,
        },
      };
      const options = getSwcOptions(
        { filename: 'file.js', root: '/root' },
        overrideOptions,
      );

      expect(options).toMatchObject(
        expect.objectContaining({
          ...overrideOptions,
          jsc: expect.objectContaining(overrideOptions.jsc),
        }),
      );
    });
  });
});

describe('getBabelOptions', () => {
  it('should match snapshot', () => {
    expect(getBabelOptions('/root')).toMatchSnapshot();
  });

  describe('when customBabelOptions present', () => {
    it('should override default options', () => {
      const overrideOptions = {
        minified: true,
        compact: true,
        sourceMaps: true,
      };
      const options = getBabelOptions('/root', overrideOptions);

      expect(options).toMatchObject(expect.objectContaining(overrideOptions));
    });
  });
});

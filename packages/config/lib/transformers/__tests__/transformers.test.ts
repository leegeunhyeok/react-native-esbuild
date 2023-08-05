import { getEsbuildOptions } from '../esbuild';
import { getSwcOptions } from '../swc';
import { getBabelOptions } from '../babel';

describe('getEsbuildOptions', () => {
  it('should match snapshot', () => {
    expect(
      getEsbuildOptions({
        entryPoint: 'index.js',
        assetsDir: 'assets',
        dev: true,
        minify: false,
        outfile: 'main.bundlejs',
        platform: 'android',
      }),
    ).toMatchSnapshot();
  });
});

describe('getSwcOptions', () => {
  it('should match snapshot', () => {
    expect(getSwcOptions({ filename: 'file.js' })).toMatchSnapshot();
  });

  describe('when filename ends with `.js`', () => {
    it('should set parse syntax to `ecmascript`', () => {
      const options = getSwcOptions({ filename: 'file.js' });
      expect(options.jsc?.parser?.syntax).toEqual('ecmascript');
    });
  });

  describe('when filename ends with `.jsx`', () => {
    it('should set parse syntax to `ecmascript`', () => {
      const options = getSwcOptions({ filename: 'file.jsx' });
      expect(options.jsc?.parser?.syntax).toEqual('ecmascript');
    });
  });

  describe('when filename ends with `.ts`', () => {
    it('should set parse syntax to `typescript`', () => {
      const options = getSwcOptions({ filename: 'file.ts' });
      expect(options.jsc?.parser?.syntax).toEqual('typescript');
    });
  });

  describe('when filename ends with `.tsx`', () => {
    it('should set parse syntax to `typescript`', () => {
      const options = getSwcOptions({ filename: 'file.tsx' });
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
      const options = getSwcOptions({ filename: 'file.js' }, overrideOptions);

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
    expect(getBabelOptions()).toMatchSnapshot();
  });

  describe('when customBabelOptions present', () => {
    it('should override default options', () => {
      const overrideOptions = {
        minified: true,
        compact: true,
        sourceMaps: true,
      };
      const options = getBabelOptions(overrideOptions);

      expect(options).toMatchObject(expect.objectContaining(overrideOptions));
    });
  });
});

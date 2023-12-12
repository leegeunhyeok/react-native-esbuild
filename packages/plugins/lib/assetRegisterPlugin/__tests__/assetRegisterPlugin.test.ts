import fs from 'node:fs/promises';
import deepmerge from 'deepmerge';
import { faker } from '@faker-js/faker';
import type { OnLoadArgs } from 'esbuild';
import {
  SUPPORT_PLATFORMS,
  type BuildContext,
  type SupportedPlatform,
} from '@react-native-esbuild/shared';
import type { AssetScale } from '@react-native-esbuild/internal';
import {
  getAssetPriority,
  addSuffix,
  stripSuffix,
  getSuffixedPath,
  resolveScaledAssets,
} from '../helpers';
import type { SuffixPathResult } from '../../types';

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
  },
}));

jest.mock('image-size', () => ({
  imageSize: jest.fn().mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Unit test.
    (_path, callback: (error: null, result: any) => void) => {
      callback(null, { width: 0, height: 0 });
    },
  ),
}));

describe('assetRegisterPlugin', () => {
  describe('getAssetPriority', () => {
    let filename: string;
    let extension: string;
    let scale: AssetScale;
    let platform: SupportedPlatform;

    beforeEach(() => {
      filename = faker.string.alphanumeric(10);
      extension = faker.helpers.arrayElement(['.png', '.jpg', '.jpeg', '.gif']);
      scale = faker.number.int({ min: 1, max: 3 }) as AssetScale;
      platform = faker.helpers.arrayElement(SUPPORT_PLATFORMS);
    });

    it('should platform and scale suffixed priority is 3', () => {
      expect(
        getAssetPriority(`${filename}@${scale}x.${platform}${extension}`),
      ).toEqual(3);
    });

    it('should platform suffixed priority is 2', () => {
      expect(getAssetPriority(`${filename}.${platform}${extension}`)).toEqual(
        2,
      );
    });

    it('should scale suffixed priority is 1', () => {
      expect(getAssetPriority(`${filename}@${scale}x${extension}`)).toEqual(1);
    });

    it('should non-suffixed priority is 0', () => {
      expect(getAssetPriority(`${filename}${extension}`)).toEqual(0);
    });
  });

  describe('addSuffix', () => {
    let filename: string;
    let extension: string;
    let scale: AssetScale;
    let platform: SupportedPlatform;

    beforeEach(() => {
      filename = faker.string.alphanumeric(10);
      extension = faker.helpers.arrayElement(['.png', '.jpg', '.jpeg', '.gif']);
      scale = faker.number.int({ min: 1, max: 3 }) as AssetScale;
      platform = faker.helpers.arrayElement(SUPPORT_PLATFORMS);
    });

    describe('when non-suffixed filename is present', () => {
      describe('when platform is present', () => {
        it('should add platform suffix', () => {
          expect(addSuffix(filename, extension, { platform })).toEqual(
            `${filename}.${platform}${extension}`,
          );
        });
      });

      describe('when scale is present', () => {
        it('should add scale suffix', () => {
          expect(addSuffix(filename, extension, { scale })).toEqual(
            `${filename}@${scale}x${extension}`,
          );
        });
      });

      describe('when platform and scale are present', () => {
        it('should add platform and scale suffix', () => {
          expect(addSuffix(filename, extension, { platform, scale })).toEqual(
            `${filename}@${scale}x.${platform}${extension}`,
          );
        });
      });
    });

    describe('when suffixed filename is present', () => {
      let previousScale: AssetScale;
      let suffixedFilename: string;

      beforeEach(() => {
        previousScale = faker.number.int({ min: 1, max: 3 }) as AssetScale;
        suffixedFilename = `${filename}@${previousScale}x${extension}`;
      });

      describe('when platform is present', () => {
        it('should add platform suffix', () => {
          expect(addSuffix(suffixedFilename, extension, { platform })).toEqual(
            `${filename}.${platform}${extension}`,
          );
        });
      });

      describe('when scale is present', () => {
        it('should override scale suffix', () => {
          expect(addSuffix(suffixedFilename, extension, { scale })).toEqual(
            `${filename}@${scale}x${extension}`,
          );
        });
      });

      describe('when platform and scale are present', () => {
        it('should add platform and override scale suffix', () => {
          expect(
            addSuffix(suffixedFilename, extension, { platform, scale }),
          ).toEqual(`${filename}@${scale}x.${platform}${extension}`);
        });
      });
    });
  });

  describe('stripSuffix', () => {
    let filename: string;
    let extension: string;
    let scale: AssetScale;
    let platform: SupportedPlatform;

    beforeEach(() => {
      filename = faker.string.alphanumeric(10);
      extension = faker.helpers.arrayElement(['.png', '.jpg', '.jpeg', '.gif']);
      scale = faker.number.int({ min: 1, max: 3 }) as AssetScale;
      platform = faker.helpers.arrayElement(SUPPORT_PLATFORMS);
    });

    describe('when platform suffixed basename is present', () => {
      let basename: string;
      let strippedBasename: string;

      beforeEach(() => {
        basename = `${filename}.${platform}${extension}`;
        strippedBasename = stripSuffix(basename, extension);
      });

      it('should return stripped basename', () => {
        expect(strippedBasename).toEqual(filename);
      });
    });

    describe('when scale suffixed basename is present', () => {
      let basename: string;
      let strippedBasename: string;

      beforeEach(() => {
        basename = `${filename}@${scale}x${extension}`;
        strippedBasename = stripSuffix(basename, extension);
      });

      it('should return stripped basename', () => {
        expect(strippedBasename).toEqual(filename);
      });
    });

    describe('when platform and scale suffixed basename is present', () => {
      let basename: string;
      let strippedBasename: string;

      beforeEach(() => {
        basename = `${filename}@${scale}x.${platform}${extension}`;
        strippedBasename = stripSuffix(basename, extension);
      });

      it('should return stripped basename', () => {
        expect(strippedBasename).toEqual(filename);
      });
    });

    describe('when non-suffixed basename is present', () => {
      let basename: string;
      let strippedBasename: string;

      beforeEach(() => {
        basename = `${filename}${extension}`;
        strippedBasename = stripSuffix(basename, extension);
      });

      it('should return stripped basename', () => {
        expect(strippedBasename).toEqual(filename);
      });
    });
  });

  describe('getSuffixedPath', () => {
    let filename: string;
    let extension: string;
    let pullPath: string;

    beforeEach(() => {
      const dirname = `/root${faker.system.directoryPath()}`;
      filename = faker.string.alphanumeric(10);
      extension = faker.helpers.arrayElement(['.png', '.jpg', '.jpeg', '.gif']);
      pullPath = `${dirname}/${filename}${extension}`;
    });

    describe('when option is empty', () => {
      let suffixPathResult: SuffixPathResult;

      beforeEach(() => {
        suffixPathResult = getSuffixedPath(pullPath);
      });

      it('should return stripped basename', () => {
        expect(suffixPathResult.basename).toEqual(filename);
      });

      it('should return same path', () => {
        expect(suffixPathResult.path).toEqual(pullPath);
      });
    });

    describe('when `platform` is present', () => {
      let platform: SupportedPlatform;
      let suffixPathResult: SuffixPathResult;

      beforeEach(() => {
        platform = faker.helpers.arrayElement(SUPPORT_PLATFORMS);
        suffixPathResult = getSuffixedPath(pullPath, { platform });
      });

      it('should return stripped basename', () => {
        expect(suffixPathResult.basename).toEqual(filename);
      });

      it('should return platform suffixed path', () => {
        expect(suffixPathResult.path).toEqual(
          pullPath.replace(extension, `.${platform}${extension}`),
        );
      });
    });

    describe('when `scale` is present', () => {
      let scale: AssetScale;
      let suffixPathResult: SuffixPathResult;

      beforeEach(() => {
        scale = faker.number.int({ min: 1, max: 3 }) as AssetScale;
        suffixPathResult = getSuffixedPath(pullPath, { scale });
      });

      it('should return stripped basename', () => {
        expect(suffixPathResult.basename).toEqual(filename);
      });

      it('should return scale suffixed path', () => {
        expect(suffixPathResult.path).toEqual(
          pullPath.replace(extension, `@${scale}x${extension}`),
        );
      });
    });

    describe('when both `platform` and `scale` are present', () => {
      let platform: SupportedPlatform;
      let scale: AssetScale;
      let suffixPathResult: SuffixPathResult;

      beforeEach(() => {
        platform = faker.helpers.arrayElement(SUPPORT_PLATFORMS);
        scale = faker.number.int({ min: 1, max: 3 }) as AssetScale;
        suffixPathResult = getSuffixedPath(pullPath, { platform, scale });
      });

      it('should return stripped basename', () => {
        expect(suffixPathResult.basename).toEqual(filename);
      });

      it('should return platform and scale suffixed path', () => {
        expect(suffixPathResult.path).toEqual(
          pullPath.replace(extension, `@${scale}x.${platform}${extension}`),
        );
      });
    });
  });

  describe('resolveScaledAssets', () => {
    let dirname: string;
    let filename: string;
    let extension: string;
    let pullPath: string;
    let mockedContext: BuildContext;
    let mockedArgs: OnLoadArgs;

    const mockContext = (platform: SupportedPlatform): void => {
      mockedContext = deepmerge(mockedContext, {
        bundleOptions: { platform },
      } as BuildContext);
    };

    const mockArgs = (platform: SupportedPlatform | null): void => {
      mockedArgs = {
        path: pullPath,
        pluginData: {
          basename: filename,
          extension,
          platform,
        },
      } as OnLoadArgs;
    };

    const mockFileSystem = (files: string[]): void => {
      fs.readdir = jest
        .fn()
        .mockImplementation((dirname: string): Promise<string[]> => {
          return Promise.resolve(files.map((file) => `${dirname}/${file}`));
        });
    };

    beforeAll(() => {
      fs.readFile = jest.fn().mockReturnValue(() => '');
    });

    beforeEach(() => {
      dirname = faker.system.directoryPath();
      filename = faker.string.alphanumeric(10);
      extension = faker.helpers.arrayElement(['.png', '.jpg', '.jpeg', '.gif']);
      pullPath = `${dirname}/${filename}${extension}`;
      mockedContext = { root: faker.system.directoryPath() } as BuildContext;
      mockedArgs = {
        path: pullPath,
        pluginData: {
          basename: filename,
          extension,
          platform: null,
        },
      } as OnLoadArgs;
    });

    describe('when platform suffixed asset is exist', () => {
      let platform: SupportedPlatform;

      beforeEach(() => {
        platform = faker.helpers.arrayElement(SUPPORT_PLATFORMS);
        mockContext(platform);
        mockArgs(platform);
        mockFileSystem([
          `${filename}.${platform}${extension}`,
          `${filename}.unknown${extension}`,
        ]);
      });

      it('should return single scale', async () => {
        const res = await resolveScaledAssets(mockedContext, mockedArgs);
        expect(res.scales.length).toEqual(1);
        expect(res.scales.includes(1)).toBeTruthy();
      });
    });

    describe('when platform and scale suffixed assets are exist', () => {
      describe('when platform is ios', () => {
        beforeEach(() => {
          const platform = 'ios';
          mockContext(platform);
          mockArgs(platform);
          mockFileSystem([
            `${filename}${extension}`,
            `${filename}@0.75x${extension}`,
            `${filename}@1x${extension}`,
            `${filename}@1.5x${extension}`,
            `${filename}@2x${extension}`,
            `${filename}@3x${extension}`,
            `${filename}@4x${extension}`,
            `${filename}.${platform}${extension}`,
            `${filename}@0.75x.${platform}${extension}`,
            `${filename}@1.5x.${platform}${extension}`,
            `${filename}@2x.${platform}${extension}`,
            `${filename}@3x.${platform}${extension}`,
            `${filename}@4x.unknown${extension}`,
          ]);
        });

        it('should exclude if not a scale of 1, 2, 3', async () => {
          const res = await resolveScaledAssets(mockedContext, mockedArgs);
          expect(res.scales.includes(0.75)).not.toBeTruthy();
          expect(res.scales.includes(1.5)).not.toBeTruthy();
          expect(res.scales.includes(4)).not.toBeTruthy();
        });

        it('should return all of suffixed scale', async () => {
          const res = await resolveScaledAssets(mockedContext, mockedArgs);
          expect(res.scales.length).toEqual(3);
          expect(res.scales.includes(1)).toBeTruthy();
          expect(res.scales.includes(2)).toBeTruthy();
          expect(res.scales.includes(3)).toBeTruthy();
          expect(res.scales.includes(4)).not.toBeTruthy();
        });
      });

      describe('when platform is android or web', () => {
        beforeEach(() => {
          const platform = faker.helpers.arrayElement([
            'android',
            'web',
          ] as const);
          mockContext(platform);
          mockArgs(platform);
          mockFileSystem([
            `${filename}${extension}`,
            `${filename}@0.75x${extension}`,
            `${filename}@1x${extension}`,
            `${filename}@1.5x${extension}`,
            `${filename}@2x${extension}`,
            `${filename}@3x${extension}`,
            `${filename}.${platform}${extension}`,
            `${filename}@0.75x.${platform}${extension}`,
            `${filename}@1.5x.${platform}${extension}`,
            `${filename}@2x.${platform}${extension}`,
            `${filename}@3x.${platform}${extension}`,
            `${filename}@4x.unknown${extension}`,
          ]);
        });

        it('should return all of suffixed scale', async () => {
          const res = await resolveScaledAssets(mockedContext, mockedArgs);
          expect(res.scales.length).toEqual(5);
          expect(res.scales.includes(0.75)).toBeTruthy();
          expect(res.scales.includes(1)).toBeTruthy();
          expect(res.scales.includes(1.5)).toBeTruthy();
          expect(res.scales.includes(2)).toBeTruthy();
          expect(res.scales.includes(3)).toBeTruthy();
          expect(res.scales.includes(4)).not.toBeTruthy();
        });
      });
    });

    describe('when scale suffixed assets are exist', () => {
      beforeEach(() => {
        mockFileSystem([
          `${filename}@0.75x${extension}`,
          `${filename}@1x${extension}`,
          `${filename}@1.5x${extension}`,
          `${filename}@2x${extension}`,
          `${filename}@3x${extension}`,
          `${filename}@4x${extension}`,
        ]);
      });

      describe('when platform is ios', () => {
        beforeEach(() => {
          mockArgs(null);
          mockContext('ios');
        });

        it('should exclude if not a scale of 1, 2, 3', async () => {
          const res = await resolveScaledAssets(mockedContext, mockedArgs);
          expect(res.scales.includes(0.75)).not.toBeTruthy();
          expect(res.scales.includes(1.5)).not.toBeTruthy();
          expect(res.scales.includes(4)).not.toBeTruthy();
        });

        it('should return only 1, 2, 3 scale suffixed assets', async () => {
          const res = await resolveScaledAssets(mockedContext, mockedArgs);
          expect(res.scales.length).toEqual(3);
          expect(res.scales.includes(1)).toBeTruthy();
          expect(res.scales.includes(2)).toBeTruthy();
          expect(res.scales.includes(3)).toBeTruthy();
        });
      });

      describe('when platform is android or web', () => {
        beforeEach(() => {
          mockContext(faker.helpers.arrayElement(['android', 'web'] as const));
        });

        it('should return all of scale suffixed assets', async () => {
          const res = await resolveScaledAssets(mockedContext, mockedArgs);
          expect(res.scales.length).toEqual(6);
          expect(res.scales.includes(0.75)).toBeTruthy();
          expect(res.scales.includes(1)).toBeTruthy();
          expect(res.scales.includes(1.5)).toBeTruthy();
          expect(res.scales.includes(2)).toBeTruthy();
          expect(res.scales.includes(3)).toBeTruthy();
          expect(res.scales.includes(4)).toBeTruthy();
        });
      });
    });

    describe('when only non-suffixed assets are exist', () => {
      beforeEach(() => {
        mockContext(faker.helpers.arrayElement(SUPPORT_PLATFORMS));
        mockFileSystem([`${filename}${extension}`]);
      });

      it('should return single scale', async () => {
        const res = await resolveScaledAssets(mockedContext, mockedArgs);
        expect(res.scales.length).toEqual(1);
        expect(res.scales.includes(1)).toBeTruthy();
      });
    });

    describe('when only @1x suffixed asset is exist', () => {
      beforeEach(() => {
        mockContext(faker.helpers.arrayElement(SUPPORT_PLATFORMS));
        mockFileSystem([`${filename}@1x${extension}`]);
      });

      it('should return single scale', async () => {
        const res = await resolveScaledAssets(mockedContext, mockedArgs);
        expect(res.scales.length).toEqual(1);
        expect(res.scales.includes(1)).toBeTruthy();
      });
    });
  });
});

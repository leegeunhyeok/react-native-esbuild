import fs from 'node:fs/promises';
import { faker } from '@faker-js/faker';
import type { OnLoadArgs } from 'esbuild';
import type { PluginContext } from '@react-native-esbuild/core';
import { getSuffixedPath, resolveScaledAssets } from '../helpers';
import type { AssetScale } from '../../types';

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
  },
}));

jest.mock('image-size', () => ({
  imageSize: jest.fn().mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_path, callback: (error: null, result: any) => void) => {
      callback(null, { width: 0, height: 0 });
    },
  ),
}));

describe('assetRegisterPlugin', () => {
  describe('getSuffixedPath', () => {
    let dirname: string;
    let filename: string;
    let extension: string;
    let pullPath: string;

    beforeEach(() => {
      dirname = `/root${faker.system.directoryPath()}`;
      filename = faker.string.alphanumeric(10);
      extension = faker.helpers.arrayElement(['.png', '.jpg', '.jpeg', '.gif']);
      pullPath = `${dirname}/${filename}${extension}`;
    });

    describe('when `scale` is not present', () => {
      it('should return same path', () => {
        const suffixedResult = getSuffixedPath(pullPath);
        expect(suffixedResult.basename).toEqual(`${filename}${extension}`);
        expect(suffixedResult.path).toEqual(pullPath);
      });
    });

    describe('when `scale` is present', () => {
      let scale: AssetScale;

      beforeEach(() => {
        scale = faker.number.int({ min: 1, max: 3 }) as AssetScale;
      });

      it('should return suffixed path', () => {
        const suffixedResult = getSuffixedPath(pullPath, scale);
        expect(suffixedResult.basename).toEqual(
          `${filename}@${scale}x${extension}`,
        );
        expect(suffixedResult.path).toEqual(
          pullPath.replace(extension, `@${scale}x${extension}`),
        );
      });
    });
  });

  describe('resolveScaledAssets', () => {
    let dirname: string;
    let filename: string;
    let extension: string;
    let pullPath: string;
    let mockedContext: PluginContext;
    let mockedArgs: OnLoadArgs;

    beforeAll(() => {
      fs.readFile = jest.fn().mockReturnValue(() => '');
    });

    beforeEach(() => {
      dirname = faker.system.directoryPath();
      filename = faker.string.alphanumeric(10);
      extension = faker.helpers.arrayElement(['.png', '.jpg', '.jpeg', 'gif']);
      pullPath = `${dirname}/${filename}${extension}`;
      mockedContext = { root: faker.system.directoryPath() } as PluginContext;
      mockedArgs = {
        path: pullPath,
        pluginData: {
          basename: `${filename}${extension}`,
          extension,
        },
      } as OnLoadArgs;
    });

    describe('when only non-suffixed asset exist', () => {
      beforeEach(() => {
        fs.readdir = jest
          .fn()
          .mockImplementation((dirname: string): Promise<string[]> => {
            return Promise.resolve([`${dirname}/${filename}${extension}`]);
          });
      });

      it('should return single scale', async () => {
        const res = await resolveScaledAssets(mockedContext, mockedArgs);
        expect(res.scales.length).toEqual(1);
        expect(res.scales.includes(1)).toBeTruthy();
      });
    });

    describe('when only @1x suffixed asset exist', () => {
      beforeEach(() => {
        fs.readdir = jest
          .fn()
          .mockImplementation((dirname: string): Promise<string[]> => {
            return Promise.resolve([`${dirname}/${filename}@1x${extension}`]);
          });
      });

      it('should return single scale', async () => {
        const res = await resolveScaledAssets(mockedContext, mockedArgs);
        expect(res.scales.length).toEqual(1);
        expect(res.scales.includes(1)).toBeTruthy();
      });
    });

    describe('when scale suffixed assets are exist', () => {
      beforeEach(() => {
        fs.readdir = jest
          .fn()
          .mockImplementation((dirname: string): Promise<string[]> => {
            return Promise.resolve([
              `${dirname}/${filename}@1x${extension}`,
              `${dirname}/${filename}@2x${extension}`,
              `${dirname}/${filename}@3x${extension}`,
            ]);
          });
      });

      it('should return all of suffixed scale', async () => {
        const res = await resolveScaledAssets(mockedContext, mockedArgs);
        expect(res.scales.length).toEqual(3);
        expect(res.scales.includes(1)).toBeTruthy();
        expect(res.scales.includes(2)).toBeTruthy();
        expect(res.scales.includes(3)).toBeTruthy();
      });
    });
  });
});

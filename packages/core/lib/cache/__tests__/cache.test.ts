import fs from 'node:fs';
import { faker } from '@faker-js/faker';
import { CacheManager } from '..';
import type { Cache } from '../../types';

describe('CacheManager', () => {
  let manager: CacheManager;
  let mockedFs: Record<string, string>;

  beforeAll(() => {
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => void 0);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation((path: string): Promise<string> => {
        const file = mockedFs[path];
        return file ? Promise.resolve(file) : Promise.reject();
      });
    jest
      .spyOn(fs.promises, 'writeFile')
      .mockImplementation((path: string, data: string): Promise<void> => {
        mockedFs[path] = data;
        return Promise.resolve();
      });
    jest.spyOn(fs.promises, 'rm').mockReturnValue(Promise.resolve());

    manager = new CacheManager();
    mockedFs = {};
  });

  describe('getCacheDirectory', () => {
    it('should match snapshot', () => {
      expect(CacheManager.getCacheDirectory()).toMatchSnapshot();
    });

    describe('when filename is present', () => {
      let filename: string;

      beforeEach(() => {
        filename = faker.system.fileName();
      });

      it('should join path with cache directory', () => {
        expect(CacheManager.getCacheDirectory(filename)).toMatch(
          new RegExp(`/${filename}$`),
        );
      });
    });
  });

  describe('memory caching', () => {
    describe('when write cache to memory', () => {
      let cacheKey: string;
      let cache: Cache;

      beforeEach(() => {
        cacheKey = faker.string.uuid();
        cache = {
          data: faker.string.alphanumeric(10),
          modifiedAt: faker.date.past().getTime(),
        };
        manager.writeToMemory(cacheKey, cache);
      });

      it('should cache data store to memory', () => {
        expect(manager.readFromMemory(cacheKey)).toMatchObject(cache);
      });

      describe('when write cache with exist key to memory', () => {
        let otherData: string;

        beforeEach(() => {
          otherData = faker.string.alphanumeric(10);
          manager.writeToMemory(cacheKey, { ...cache, data: otherData });
        });

        it('should overwrite exist cache data', () => {
          expect(manager.readFromMemory(cacheKey)).not.toMatchObject(cache);
          expect(manager.readFromMemory(cacheKey)).toMatchObject({
            ...cache,
            data: otherData,
          });
        });
      });
    });
  });

  describe('file system caching', () => {
    let hash: string;
    let data: string;

    beforeEach(async () => {
      const hashParam = { _: faker.string.alphanumeric(10) };
      hash = manager.getCacheHash(hashParam);
      data = faker.string.alphanumeric(10);
      await manager.writeToFileSystem(hash, data);
    });

    describe('when write data to file system', () => {
      it('should store data to file system', async () => {
        expect(await manager.readFromFileSystem(hash)).toEqual(data);
      });
    });
  });
});

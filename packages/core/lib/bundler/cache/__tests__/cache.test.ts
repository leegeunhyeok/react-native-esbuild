import fs from 'node:fs';
import { faker } from '@faker-js/faker';
import type { Cache } from '@react-native-esbuild/shared';
import { CacheStorageImpl } from '../CacheStorageImpl';

describe('CacheStorageImpl', () => {
  let storage: CacheStorageImpl;
  let mockedFs: Record<string, string>;

  beforeAll(() => {
    jest.spyOn(fs, 'accessSync').mockImplementation(() => void 0);
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

    storage = new CacheStorageImpl();
    mockedFs = {};
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('memory caching', () => {
    describe('when write cache to memory', () => {
      let cacheKey: string;
      let cache: Cache;

      beforeEach(() => {
        cacheKey = faker.string.uuid();
        cache = {
          data: faker.string.alphanumeric(10),
          mtimeMs: faker.date.past().getTime(),
        };
        storage.writeToMemory(cacheKey, cache);
      });

      it('should cache data store to memory', () => {
        expect(storage.readFromMemory(cacheKey)).toMatchObject(cache);
      });

      describe('when write cache with exist key to memory', () => {
        let otherData: string;

        beforeEach(() => {
          otherData = faker.string.alphanumeric(10);
          storage.writeToMemory(cacheKey, { ...cache, data: otherData });
        });

        it('should overwrite exist cache data', () => {
          expect(storage.readFromMemory(cacheKey)).not.toMatchObject(cache);
          expect(storage.readFromMemory(cacheKey)).toMatchObject({
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
      hash = faker.string.alphanumeric(10);
      data = faker.string.alphanumeric(10);
      await storage.writeToFileSystem(hash, data);
    });

    describe('when write data to file system', () => {
      it('should store data to file system', async () => {
        expect(await storage.readFromFileSystem(hash)).toEqual(data);
      });
    });
  });
});

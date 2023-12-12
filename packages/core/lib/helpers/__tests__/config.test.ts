import { faker } from '@faker-js/faker';
import type { Config } from '@react-native-esbuild/shared';
import { loadConfig, getConfigFromGlobal } from '../config';

describe('config helpers', () => {
  describe('loadConfig', () => {
    beforeEach(() => {
      self._config = undefined;
    });

    afterAll(() => {
      delete self._config;
    });

    describe('when call loadConfig', () => {
      beforeEach(() => {
        loadConfig(faker.system.filePath());
      });

      it('should caching config data to global', () => {
        expect(self._config).not.toBeUndefined();
      });
    });
  });

  describe('getConfigFromGlobal', () => {
    beforeEach(() => {
      delete self._config;
    });

    describe('when call before load', () => {
      it('should throw error', () => {
        expect(() => getConfigFromGlobal()).toThrowError();
      });
    });

    describe('when call after load', () => {
      let config: Config;

      beforeEach(() => {
        config = loadConfig(faker.system.filePath());
      });

      it('should return cached config object', () => {
        expect(getConfigFromGlobal()).toEqual(expect.objectContaining(config));
      });
    });
  });
});

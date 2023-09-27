import { faker } from '@faker-js/faker';
import { LogLevel, Logger } from '../logger';

describe('logger', () => {
  let logger: Logger;
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;

  beforeAll(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write');
    stderrSpy = jest.spyOn(process.stderr, 'write');
    logger = new Logger('');
  });

  afterAll(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  describe('when logger is enabled', () => {
    beforeAll(() => {
      Logger.enable();
    });

    beforeEach(() => {
      stdoutSpy.mockReset();
      stderrSpy.mockReset();
    });

    describe('when print stdout log', () => {
      beforeEach(() => {
        logger.info(faker.lorem.paragraph());
      });

      it('should flush message to stream', () => {
        expect(stdoutSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when print stderr log', () => {
      beforeEach(() => {
        logger.error(faker.lorem.paragraph());
      });

      it('should flush message to stream', () => {
        expect(stderrSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when log level is set to info', () => {
      beforeAll(() => {
        logger.setLogLevel(LogLevel.Info);
      });

      describe('when print debug level log', () => {
        beforeEach(() => {
          logger.debug(faker.lorem.paragraph());
        });

        it('should avoid flush', () => {
          expect(stdoutSpy).not.toHaveBeenCalled();
        });
      });

      describe('when print info level log', () => {
        beforeEach(() => {
          logger.info(faker.lorem.paragraph());
        });

        it('should avoid flush', () => {
          expect(stdoutSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('when log level is set to debug', () => {
      beforeAll(() => {
        logger.setLogLevel(LogLevel.Debug);
      });

      describe('when print debug level log', () => {
        beforeEach(() => {
          logger.debug(faker.lorem.paragraph());
        });

        it('should flush message to stream', () => {
          expect(stdoutSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('when print info level log', () => {
        beforeEach(() => {
          logger.info(faker.lorem.paragraph());
        });

        it('should flush message to stream', () => {
          expect(stdoutSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('when extra data is present', () => {
      let extra: object;

      beforeEach(() => {
        extra = { value: faker.string.alphanumeric() };
        logger.info(faker.lorem.paragraph(), extra);
      });

      it('should print stringify extra with message', () => {
        expect(stdoutSpy).toHaveBeenCalledTimes(1);
        expect(stdoutSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            JSON.stringify(extra, null, 2)
              .replace(/(?:{|})/g, '')
              .trim(),
          ),
        );
      });
    });

    describe('when error data is present', () => {
      let error: Error;

      beforeEach(() => {
        error = new Error();
        logger.error(faker.lorem.paragraph(), error);
      });

      it('should print stack information with message', () => {
        expect(stderrSpy).toHaveBeenCalledTimes(1);
        expect(stderrSpy).toHaveBeenCalledWith(
          expect.stringContaining(error.stack ?? ''),
        );
      });
    });
  });

  describe('when logger is disabled', () => {
    beforeAll(() => {
      Logger.disable();
    });

    beforeEach(() => {
      stdoutSpy.mockReset();
      stderrSpy.mockReset();
    });

    describe('when print stdout log', () => {
      beforeEach(() => {
        logger.info(faker.lorem.paragraph());
      });

      it('should avoid flush', () => {
        expect(stdoutSpy).not.toHaveBeenCalled();
      });
    });

    describe('when print stderr log', () => {
      beforeEach(() => {
        logger.error(faker.lorem.paragraph());
      });

      it('should avoid flush', () => {
        expect(stderrSpy).not.toHaveBeenCalled();
      });
    });
  });
});

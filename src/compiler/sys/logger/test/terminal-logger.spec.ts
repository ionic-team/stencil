import { LogLevel } from '@stencil/core/declarations';
import { createNodeLoggerSys } from '../../../../sys/node/node-logger';
import { createTerminalLogger, LOG_LEVELS, shouldLog } from '../terminal-logger';
import { bold, cyan, dim, red, yellow } from 'ansi-colors';

describe('terminal-logger', () => {
  describe('shouldLog helper', () => {
    it.each(LOG_LEVELS)("should log errors at level '%s'", (currentLevel: LogLevel) => {
      expect(shouldLog(currentLevel, 'error')).toBe(true);
    });

    it.each<[LogLevel, boolean]>([
      ['debug', true],
      ['info', true],
      ['warn', true],
      ['error', false],
    ])("shouldLog for warnings at level '%s' should be '%p'", (currentLevel, expected) => {
      expect(shouldLog(currentLevel, 'warn')).toBe(expected);
    });

    it.each<[LogLevel, boolean]>([
      ['debug', true],
      ['info', true],
      ['warn', false],
      ['error', false],
    ])("shouldLog for info at level '%s' should be '%p'", (currentLevel, expected) => {
      expect(shouldLog(currentLevel, 'info')).toBe(expected);
    });

    it.each<[LogLevel, boolean]>([
      ['debug', true],
      ['info', false],
      ['warn', false],
      ['error', false],
    ])("shouldLog for debug messages at level '%s' should be '%p'", (currentLevel, expected) => {
      expect(shouldLog(currentLevel, 'debug')).toBe(expected);
    });
  });

  describe('basic logging functionality', () => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    afterAll(() => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    });

    function setup() {
      const logMock = jest.fn();
      const warnMock = jest.fn();
      const errorMock = jest.fn();

      console.log = logMock;
      console.warn = warnMock;
      console.error = errorMock;

      const loggerSys = createNodeLoggerSys(process);

      loggerSys.memoryUsage = jest.fn().mockReturnValue(10_000_000);

      const writeLogsMock = jest.fn();
      loggerSys.writeLogs = writeLogsMock;

      const logger = createTerminalLogger(loggerSys);

      jest.useFakeTimers().setSystemTime(new Date(2022, 6, 3, 9, 32, 32, 32));

      return { logger, logMock, warnMock, errorMock, writeLogsMock };
    }

    it("supports 'debug' level", () => {
      const { logger, logMock } = setup();
      logger.setLevel('debug');
      logger.debug('my debug message');
      expect(logMock).toBeCalledWith(`${cyan('[32:32.0]')}  my debug message ${dim(' MEM: 10.0MB')}`);
    });

    it("supports 'info' level", () => {
      const { logger, logMock } = setup();
      logger.info('my info message');
      expect(logMock).toBeCalledWith(`${dim('[32:32.0]')}  my info message`);
    });

    it("supports 'warn' level", () => {
      const { logger, warnMock } = setup();
      logger.warn('my warn message');
      expect(warnMock).toBeCalledWith(`\n${bold(yellow('[ WARN  ]'))}  my warn message\n`);
    });

    it("supports 'error' level", () => {
      const { logger, errorMock } = setup();
      logger.error('my error message');
      expect(errorMock).toBeCalledWith(`\n${bold(red('[ ERROR ]'))}  my error message\n`);
    });

    it('supports shipping logs to a file', function () {
      const { logger, writeLogsMock } = setup();
      logger.setLogFilePath!('testfile.txt');
      logger.info('test message');
      logger.writeLogs!(false);
      const expectedLogfile = [
        '09:32:32.00  0010.0MB  I  test message',
        '09:32:32.00  0010.0MB  F  --------------------------------------',
      ].join('\n');
      expect(writeLogsMock).toBeCalledWith('testfile.txt', expectedLogfile, false);
    });

    describe('timespans', () => {
      it('has basic support for timespans', function () {
        const { logger, logMock } = setup();
        const timespan = logger.createTimeSpan('start the timespan');
        jest.advanceTimersByTime(10_000);
        timespan.finish('finish the timespan');

        expect(logMock).toHaveBeenNthCalledWith(1, `${dim('[32:32.0]')}  start the timespan ${dim('...')}`);
        expect(logMock).toHaveBeenNthCalledWith(2, `${dim('[32:42.0]')}  finish the timespan ${dim('in 10.00 s')}`);
      });

      describe('debug timespan', function () {
        it('supports passing a debug flag', function () {
          const { logger, logMock } = setup();
          logger.setLevel('debug');
          const timespan = logger.createTimeSpan('start the timespan', true);
          jest.advanceTimersByTime(10_000);
          timespan.finish('finish the timespan');

          expect(logMock).toHaveBeenNthCalledWith(
            1,
            `${cyan('[32:32.0]')}  start the timespan ${dim('...')} ${dim(' MEM: 10.0MB')}`
          );
          expect(logMock).toHaveBeenNthCalledWith(
            2,
            `${cyan('[32:42.0]')}  finish the timespan ${dim('in 10.00 s')} ${dim(' MEM: 10.0MB')}`
          );
        });

        it('supports writing debug messages to the logfile', () => {
          const { logger, writeLogsMock } = setup();
          logger.setLogFilePath!('testfile.txt');
          logger.setLevel('debug');
          const timespan = logger.createTimeSpan('start the timespan', true);
          jest.advanceTimersByTime(10_000);
          timespan.finish('finish the timespan');
          logger.writeLogs!(false);

          const expectedLogfile = [
            '09:32:32.00  0010.0MB  D  start the timespan ...',
            '09:32:42.00  0010.0MB  D  finish the timespan in 10.00 s',
            '09:32:42.00  0010.0MB  F  --------------------------------------',
          ].join('\n');
          expect(writeLogsMock).toBeCalledWith('testfile.txt', expectedLogfile, false);
        });

        it.each<LogLevel>(['info', 'error', 'warn'])(
          "shouldn't write to the console when logLevel is '%s' (less verbose than 'debug')",
          (level) => {
            const { logger, logMock } = setup();
            logger.setLevel(level);
            const timespan = logger.createTimeSpan('start the timespan', true);
            jest.advanceTimersByTime(10_000);
            timespan.finish('finish the timespan');
            expect(logMock).not.toHaveBeenCalled();
          }
        );
      });

      it('reports the number of milliseconds if timespan takes under a second', () => {
        const { logger, logMock } = setup();
        const timespan = logger.createTimeSpan('start the timespan');
        jest.advanceTimersByTime(10);
        timespan.finish('finish the timespan');

        expect(logMock).toHaveBeenNthCalledWith(1, `${dim('[32:32.0]')}  start the timespan ${dim('...')}`);
        expect(logMock).toHaveBeenNthCalledWith(2, `${dim('[32:32.0]')}  finish the timespan ${dim('in 10 ms')}`);
      });

      it("doesn't report an exact time if it's less than 1ms", function () {
        const { logger, logMock } = setup();
        const timespan = logger.createTimeSpan('start the timespan');
        timespan.finish('finish the timespan');

        expect(logMock).toHaveBeenNthCalledWith(1, `${dim('[32:32.0]')}  start the timespan ${dim('...')}`);
        expect(logMock).toHaveBeenNthCalledWith(
          2,
          `${dim('[32:32.0]')}  finish the timespan ${dim('in less than 1 ms')}`
        );
      });

      it('writes timespans to the log file, if configured', () => {
        const { logger, writeLogsMock } = setup();
        logger.setLogFilePath!('testfile.txt');
        const timespan = logger.createTimeSpan('start the timespan');
        jest.advanceTimersByTime(10_000);
        timespan.finish('finish the timespan');
        logger.writeLogs!(false);

        const expectedLogfile = [
          '09:32:32.00  0010.0MB  I  start the timespan ...',
          '09:32:42.00  0010.0MB  I  finish the timespan in 10.00 s',
          '09:32:42.00  0010.0MB  F  --------------------------------------',
        ].join('\n');
        expect(writeLogsMock).toBeCalledWith('testfile.txt', expectedLogfile, false);
      });
    });
  });
});

import { LogLevel } from '@stencil/core/declarations';
import {createNodeLoggerSys} from '../../../../sys/node/node-logger'
import { createTerminalLogger, LOG_LEVELS, shouldLog } from '../terminal-logger';

describe('terminal-logger', () => {
  describe('shouldLog helper', () => {
    it.each(LOG_LEVELS)("should log errors at level '%s'", (currentLevel: LogLevel) => {
      expect(shouldLog(currentLevel, 'error')).toBe(true);
    });
  });

  describe('basic logging functionality', () => {
    function setup() {
      const logSpy = jest.spyOn(console, 'log');
      const logger = createTerminalLogger(
        createNodeLoggerSys(process)
      )
      return { logger, logSpy }
    }

    it.each(LOG_LEVELS)("supports %s level", (level) => {
      const { logger, logSpy } = setup();
      logger[level](`my ${level} message`)
      console.log(logSpy.mock.calls);
      expect(logSpy.mock.calls[0][0].includes("my ${level} message")).toBe(true)
    })
  });
});

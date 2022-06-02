import { LogLevel } from '@stencil/core/declarations';
import { LOG_LEVELS, shouldLog } from '../terminal-logger';

describe('terminal-logger', () => {
  describe('shouldLog helper', () => {
    it.each(LOG_LEVELS)("should log errors at level '%s'", (currentLevel: LogLevel) => {
      expect(shouldLog(currentLevel, 'error')).toBe(true);
    });
  });

  describe('basic logging functionality', () => {
    function setup() {
      const logSpy = jest.spyOn(console, 'log');
    }

    it("supports info level", () => {
    })
  });
});

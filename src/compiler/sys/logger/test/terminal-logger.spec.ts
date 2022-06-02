import { LogLevel } from '@stencil/core/declarations';
import { LOG_LEVELS, shouldLog } from '../terminal-logger';

describe('terminal-logger', () => {
  describe('shouldLog helper', () => {
    it.each(LOG_LEVELS)("should log errors at level '%s'", (currentLevel: LogLevel) => {
      expect(shouldLog(currentLevel, 'error')).toBe(true);
    });
  });
});

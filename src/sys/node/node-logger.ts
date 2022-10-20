import fs from 'graceful-fs';
import path from 'path';

import { createTerminalLogger, TerminalLoggerSys } from '../../compiler/sys/logger/terminal-logger';
import { Logger } from '../../declarations';

/**
 * Create a logger to run in a Node environment
 * @param context a context with NodeJS specific details used to create the logger
 * @returns the created logger
 */
export const createNodeLogger = (context: { process: NodeJS.Process }): Logger => {
  const loggerSys = createNodeLoggerSys(context.process);
  const logger = createTerminalLogger(loggerSys);
  return logger;
};

/**
 * Create a logger sys object for use in a Node.js environment
 *
 * The `TerminalLoggerSys` interface basically abstracts away some
 * environment-specific details so that the terminal logger can deal with
 * things in a (potentially) platform-agnostic way.
 *
 * @param prcs the current node.js process object
 * @returns a configured logger sys object
 */
export function createNodeLoggerSys(prcs: NodeJS.Process): TerminalLoggerSys {
  const cwd = () => prcs.cwd();

  const emoji = (emoji: string) => (prcs.platform !== 'win32' ? emoji : '');

  /**
   * Get the number of columns for the terminal to use when printing
   * @returns the number of columns to use
   */
  const getColumns = () => {
    const min_columns = 60;
    const max_columns = 120;
    const defaultWidth = 80;

    const terminalWidth = prcs?.stdout?.columns ?? defaultWidth;
    return Math.max(Math.min(terminalWidth, max_columns), min_columns);
  };

  const memoryUsage = () => prcs.memoryUsage().rss;

  const relativePath = (from: string, to: string) => path.relative(from, to);

  const writeLogs = (logFilePath: string, log: string, append: boolean) => {
    if (append) {
      try {
        fs.accessSync(logFilePath);
      } catch (e) {
        append = false;
      }
    }

    if (append) {
      fs.appendFileSync(logFilePath, log);
    } else {
      fs.writeFileSync(logFilePath, log);
    }
  };

  const createLineUpdater = async () => {
    const readline = await import('readline');
    let promise = Promise.resolve();
    const update = (text: string) => {
      text = text.substring(0, prcs.stdout.columns - 5) + '\x1b[0m';
      return (promise = promise.then(() => {
        return new Promise<any>((resolve) => {
          readline.clearLine(prcs.stdout, 0);
          readline.cursorTo(prcs.stdout, 0, null);
          prcs.stdout.write(text, resolve);
        });
      }));
    };

    const stop = () => {
      return update('\x1B[?25h');
    };

    // hide cursor
    prcs.stdout.write('\x1B[?25l');
    return {
      update,
      stop,
    };
  };

  return {
    cwd,
    emoji,
    getColumns,
    memoryUsage,
    relativePath,
    writeLogs,
    createLineUpdater,
  };
}

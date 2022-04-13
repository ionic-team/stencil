import { Logger } from '../../declarations';
import { createTerminalLogger, ColorType, TerminalLoggerSys } from '../../compiler/sys/logger/terminal-logger';
import ansiColor from 'ansi-colors';
import fs from 'graceful-fs';
import path from 'path';

/**
 * Create a logger to run in a Node environment
 * @param context a context with NodeJS specific details used to create the logger
 * @returns the created logger
 */
export const createNodeLogger = (context: { process: NodeJS.Process }): Logger => {
  let useColors = true;
  const prcs: NodeJS.Process = context.process;
  const minColumns = 60;
  const maxColumns = 120;

  const color = (msg: string, colorType: ColorType) => (useColors ? (ansiColor as any)[colorType](msg) : msg);

  const cwd = () => prcs.cwd();

  const emoji = (e: string) => (prcs.platform !== 'win32' ? e : '');

  const enableColors = (uc: boolean) => (useColors = uc);

  const getColumns = () => {
    const terminalWidth = (prcs.stdout && (prcs.stdout as any).columns) || 80;
    return Math.max(Math.min(maxColumns, terminalWidth), minColumns);
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

  const loggerSys: TerminalLoggerSys = {
    color,
    cwd,
    emoji,
    enableColors,
    getColumns,
    memoryUsage,
    relativePath,
    writeLogs,
  };

  const logger = createTerminalLogger(loggerSys);

  logger.createLineUpdater = async () => {
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

  return logger;
};

import { Diagnostic } from '../../diagnostic';

/**
 * This sets the log level hierarchy for our terminal logger, ranging from
 * most to least verbose.
 *
 * Ordering the levels like this lets us easily check whether we should log a
 * message at a given time. For instance, if the log level is set to `'warn'`,
 * then anything passed to the logger with level `'warn'` or `'error'` should
 * be logged, but we should _not_ log anything with level `'info'` or `'debug'`.
 *
 * If we have a current log level `currentLevel` and a message with level
 * `msgLevel` is passed to the logger, we can determine whether or not we should
 * log it by checking if the log level on the message is further up or at the
 * same level in the hierarchy than `currentLevel`, like so:
 *
 * ```ts
 * LOG_LEVELS.indexOf(msgLevel) >= LOG_LEVELS.indexOf(currentLevel)
 * ```
 *
 * NOTE: for the reasons described above, do not change the order of the entries
 * in this array without good reason!
 */
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;

export type LogLevel = typeof LOG_LEVELS[number];

/**
 * Common logger to be used by the compiler, dev-server and CLI. The CLI will use a
 * NodeJS based console logging and colors, and the web will use browser based
 * logs and colors.
 */
export interface Logger {
  enableColors: (useColors: boolean) => void;
  setLevel: (level: LogLevel) => void;
  getLevel: () => LogLevel;
  debug: (...msg: any[]) => void;
  info: (...msg: any[]) => void;
  warn: (...msg: any[]) => void;
  error: (...msg: any[]) => void;
  createTimeSpan: (startMsg: string, debug?: boolean, appendTo?: string[]) => LoggerTimeSpan;
  printDiagnostics: (diagnostics: Diagnostic[], cwd?: string) => void;
  red: (msg: string) => string;
  green: (msg: string) => string;
  yellow: (msg: string) => string;
  blue: (msg: string) => string;
  magenta: (msg: string) => string;
  cyan: (msg: string) => string;
  gray: (msg: string) => string;
  bold: (msg: string) => string;
  dim: (msg: string) => string;
  bgRed: (msg: string) => string;
  emoji: (e: string) => string;
  setLogFilePath?: (p: string) => void;
  writeLogs?: (append: boolean) => void;
  createLineUpdater?: () => Promise<LoggerLineUpdater>;
}

export interface LoggerLineUpdater {
  update(text: string): Promise<void>;
  stop(): Promise<void>;
}

export interface LoggerTimeSpan {
  duration(): number;
  finish(finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean): number;
}

export interface PrintLine {
  lineIndex: number;
  lineNumber: number;
  text?: string;
  errorCharStart: number;
  errorLength?: number;
}

import type * as d from '../../../declarations';
import { IS_BROWSER_ENV } from '../environment';

/**
 * Creates an instance of a logger
 * @returns the new logger instance
 */
export const createLogger = (): d.Logger => {
  let useColors = IS_BROWSER_ENV;
  let level: d.LogLevel = 'info';

  return {
    enableColors: (uc) => (useColors = uc),
    getLevel: () => level,
    setLevel: (l) => (level = l),
    emoji: (e) => e,
    info: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug.bind(console),
    red: (msg) => msg,
    green: (msg) => msg,
    yellow: (msg) => msg,
    blue: (msg) => msg,
    magenta: (msg) => msg,
    cyan: (msg) => msg,
    gray: (msg) => msg,
    bold: (msg) => msg,
    dim: (msg) => msg,
    bgRed: (msg) => msg,
    createTimeSpan: (_startMsg: string, _debug = false): d.LoggerTimeSpan => ({
      duration: () => 0,
      finish: () => 0,
    }),
    printDiagnostics(diagnostics: d.Diagnostic[]) {
      diagnostics.forEach((diagnostic) => logDiagnostic(diagnostic, useColors));
    },
  };
};

const logDiagnostic = (diagnostic: d.Diagnostic, useColors: boolean) => {
  let color = BLUE;
  let prefix = 'Build';
  let msg = '';

  if (diagnostic.level === 'error') {
    color = RED;
    prefix = 'Error';
  } else if (diagnostic.level === 'warn') {
    color = YELLOW;
    prefix = 'Warning';
  }

  if (diagnostic.header) {
    prefix = diagnostic.header;
  }

  const filePath = diagnostic.relFilePath || diagnostic.absFilePath;
  if (filePath) {
    msg += filePath;

    if (typeof diagnostic.lineNumber === 'number' && diagnostic.lineNumber > 0) {
      msg += ', line ' + diagnostic.lineNumber;

      if (typeof diagnostic.columnNumber === 'number' && diagnostic.columnNumber > 0) {
        msg += ', column ' + diagnostic.columnNumber;
      }
    }
    msg += '\n';
  }

  msg += diagnostic.messageText;

  if (diagnostic.lines && diagnostic.lines.length > 0) {
    diagnostic.lines.forEach((l) => {
      msg += '\n' + l.lineNumber + ':  ' + l.text;
    });
    msg += '\n';
  }

  if (useColors) {
    const styledPrefix = [
      '%c' + prefix,
      `background: ${color}; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`,
    ];
    console.log(...styledPrefix, msg);
  } else if (diagnostic.level === 'error') {
    console.error(msg);
  } else if (diagnostic.level === 'warn') {
    console.warn(msg);
  } else {
    console.log(msg);
  }
};

const YELLOW = `#f39c12`;
const RED = `#c0392b`;
const BLUE = `#3498db`;

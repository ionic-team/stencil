import * as d from '../../declarations';


export const browserLogger = (config: d.BrowserConfig) => {
  const logger: d.Logger = {
    level: '',
    info(...msg: any[]) {
      config.win.console.log.apply(config.win.console, msg);
    },
    warn(...msg: any[]) {
      config.win.console.warn.apply(config.win.console, msg);
    },
    error(...msg: any[]) {
      config.win.console.error.apply(config.win.console, msg);
    },
    debug(...msg: any[]) {
      config.win.console.log.apply(config.win.console, msg);
    },
    red(msg: string) { return msg; },
    green(msg: string) { return msg; },
    yellow(msg: string) { return msg; },
    blue(msg: string) { return msg; },
    magenta(msg: string) { return msg; },
    cyan(msg: string) { return msg; },
    gray(msg: string) { return msg; },
    bold(msg: string) { return msg; },
    dim(msg: string) { return msg; },
    createTimeSpan(_startMsg: string, _debug = false): d.LoggerTimeSpan {
      return {
        duration() { return 0; },
        finish() { return 0; }
      };
    },
    printDiagnostics(diagnostics: d.Diagnostic[]) {
      diagnostics.forEach(diagnostic => {
        logDiagnostic(config.win, diagnostic);
      });
    },
    buildLogFilePath: null,
    writeLogs(_: boolean) { /**/ }
  };
  return logger;
};


const logDiagnostic = (win: Window, diagnostic: d.Diagnostic) => {
  let color = BLUE;
  let prefix = 'Build';

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

  let msg = ``;

  if (diagnostic.relFilePath) {
    msg += diagnostic.relFilePath;

    if (typeof diagnostic.lineNumber === 'number' && diagnostic.lineNumber > 0) {
      msg += ', line ' + diagnostic.lineNumber;

      if (typeof diagnostic.columnNumber === 'number' && diagnostic.columnNumber > 0) {
        msg += ', column ' + diagnostic.columnNumber;
      }
    }
    msg += `\n`;
  }

  msg += diagnostic.messageText;

  const styledPrefix = [
    '%c' + prefix,
    `background: ${color}; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`
  ];

  win.console.log(...styledPrefix, msg);
};


const YELLOW = `#f39c12`;
const RED = `#c0392b`;
const BLUE = `#3498db`;

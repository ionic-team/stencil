import * as d from '../../declarations';

export const createLogger = () => {
  const logger: d.Logger = {
    colors: true,
    level: '',
    info: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug.bind(console),
    red(msg: string) {
      return msg;
    },
    green(msg: string) {
      return msg;
    },
    yellow(msg: string) {
      return msg;
    },
    blue(msg: string) {
      return msg;
    },
    magenta(msg: string) {
      return msg;
    },
    cyan(msg: string) {
      return msg;
    },
    gray(msg: string) {
      return msg;
    },
    bold(msg: string) {
      return msg;
    },
    dim(msg: string) {
      return msg;
    },
    bgRed(msg: string) {
      return msg;
    },
    createTimeSpan(_startMsg: string, _debug = false): d.LoggerTimeSpan {
      return {
        duration() {
          return 0;
        },
        finish() {
          return 0;
        },
      };
    },
    printDiagnostics(diagnostics: d.Diagnostic[]) {
      diagnostics.forEach(diagnostic => {
        logDiagnostic(diagnostic, logger.colors);
      });
    },
    buildLogFilePath: null,
    writeLogs(_: boolean) {
      /**/
    },
  };
  return logger;
};

const logDiagnostic = (diagnostic: d.Diagnostic, colors: boolean) => {
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

  let msg = '';

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
    diagnostic.lines.forEach(l => {
      msg += '\n' + l.lineNumber + ':  ' + l.text;
    });
    msg += '\n';
  }

  if (colors) {
    const styledPrefix = ['%c' + prefix, `background: ${color}; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`];

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

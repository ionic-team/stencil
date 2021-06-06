import { Diagnostic, Logger, LogLevel, LoggerTimeSpan, PrintLine } from '../../../declarations';

export const createTerminalLogger = (loggerSys: TerminalLoggerSys) => {
  let level: LogLevel = 'info';
  let logFilePath: string = null;
  const writeLogQueue: string[] = [];

  const setLevel = (l: LogLevel) => (level = l);

  const getLevel = () => level;

  const setLogFilePath = (p: string) => (logFilePath = p);

  const info = (...msg: any[]) => {
    if (shouldLog('info')) {
      const lines = wordWrap(msg, loggerSys.getColumns());
      infoPrefix(lines);
      console.log(lines.join('\n'));
    }
    queueWriteLog('I', msg);
  };

  const infoPrefix = (lines: string[]) => {
    if (lines.length) {
      const d = new Date();
      const prefix = '[' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2) + '.' + Math.floor((d.getMilliseconds() / 1000) * 10) + ']';

      lines[0] = dim(prefix) + lines[0].substr(prefix.length);
    }
  };

  const warn = (...msg: any[]) => {
    if (shouldLog('warn')) {
      const lines = wordWrap(msg, loggerSys.getColumns());
      warnPrefix(lines);
      console.warn('\n' + lines.join('\n') + '\n');
    }
    queueWriteLog('W', msg);
  };

  const warnPrefix = (lines: string[]) => {
    if (lines.length) {
      const prefix = '[ WARN  ]';
      lines[0] = bold(yellow(prefix)) + lines[0].substr(prefix.length);
    }
  };

  const error = (...msg: any[]) => {
    for (let i = 0; i < msg.length; i++) {
      if (msg[i] instanceof Error) {
        const err: Error = msg[i];
        msg[i] = err.message;
        if (err.stack) {
          msg[i] += '\n' + err.stack;
        }
      }
    }

    if (shouldLog('error')) {
      const lines = wordWrap(msg, loggerSys.getColumns());
      errorPrefix(lines);
      console.error('\n' + lines.join('\n') + '\n');
    }
    queueWriteLog('E', msg);
  };

  const errorPrefix = (lines: string[]) => {
    if (lines.length) {
      const prefix = '[ ERROR ]';
      lines[0] = bold(red(prefix)) + lines[0].substr(prefix.length);
    }
  };

  const debug = (...msg: any[]) => {
    if (shouldLog('debug')) {
      const mem = loggerSys.memoryUsage();
      if (mem > 0) {
        msg.push(dim(` MEM: ${(loggerSys.memoryUsage() / 1000000).toFixed(1)}MB`));
      }
      const lines = wordWrap(msg, loggerSys.getColumns());
      debugPrefix(lines);
      console.log(lines.join('\n'));
    }
    queueWriteLog('D', msg);
  };

  const debugPrefix = (lines: string[]) => {
    if (lines.length) {
      const d = new Date();

      const prefix = '[' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2) + '.' + Math.floor((d.getMilliseconds() / 1000) * 10) + ']';

      lines[0] = cyan(prefix) + lines[0].substr(prefix.length);
    }
  };

  const timespanStart = (startMsg: string, debug: boolean, appendTo: string[]) => {
    const msg = [`${startMsg} ${dim('...')}`];

    if (debug) {
      if (shouldLog('debug')) {
        const mem = loggerSys.memoryUsage();
        if (mem > 0) {
          msg.push(dim(` MEM: ${(loggerSys.memoryUsage() / 1000000).toFixed(1)}MB`));
        }
        const lines = wordWrap(msg, loggerSys.getColumns());
        debugPrefix(lines);
        console.log(lines.join('\n'));
        queueWriteLog('D', [`${startMsg} ...`]);
      }
    } else {
      const lines = wordWrap(msg, loggerSys.getColumns());
      infoPrefix(lines);
      console.log(lines.join('\n'));
      queueWriteLog('I', [`${startMsg} ...`]);
      if (appendTo) {
        appendTo.push(`${startMsg} ...`);
      }
    }
  };

  const timespanFinish = (finishMsg: string, timeSuffix: string, colorName: 'red', textBold: boolean, newLineSuffix: boolean, debug: boolean, appendTo: string[]) => {
    let msg = finishMsg;

    if (colorName) {
      msg = loggerSys.color(finishMsg, colorName);
    }
    if (textBold) {
      msg = bold(msg);
    }

    msg += ' ' + dim(timeSuffix);

    if (debug) {
      if (shouldLog('debug')) {
        const m = [msg];
        const mem = loggerSys.memoryUsage();
        if (mem > 0) {
          m.push(dim(` MEM: ${(mem / 1000000).toFixed(1)}MB`));
        }
        
        const lines = wordWrap(m, loggerSys.getColumns());
        debugPrefix(lines);
        console.log(lines.join('\n'));
      }
      queueWriteLog('D', [`${finishMsg} ${timeSuffix}`]);
    } else {
      const lines = wordWrap([msg], loggerSys.getColumns());
      infoPrefix(lines);
      console.log(lines.join('\n'));
      queueWriteLog('I', [`${finishMsg} ${timeSuffix}`]);

      if (appendTo) {
        appendTo.push(`${finishMsg} ${timeSuffix}`);
      }
    }

    if (newLineSuffix) {
      console.log('');
    }
  };

  const createTimeSpan = (startMsg: string, debug = false, appendTo?: string[]) => {
    const start = Date.now();
    const duration = () => Date.now() - start;
    const timeSpan: LoggerTimeSpan = {
      duration,
      finish: (finishMsg, colorName, textBold, newLineSuffix) => {
        const dur = duration();
        let time: string;

        if (dur > 1000) {
          time = 'in ' + (dur / 1000).toFixed(2) + ' s';
        } else {
          const ms = parseFloat(dur.toFixed(3));
          if (ms > 0) {
            time = 'in ' + dur + ' ms';
          } else {
            time = 'in less than 1 ms';
          }
        }

        timespanFinish(finishMsg, time, colorName as any, textBold, newLineSuffix, debug, appendTo);

        return dur;
      },
    };
    timespanStart(startMsg, debug, appendTo);
    return timeSpan;
  };

  const queueWriteLog = (prefix: string, msg: any[]) => {
    if (logFilePath) {
      const d = new Date();
      const log =
        '' +
        ('0' + d.getHours()).slice(-2) +
        ':' +
        ('0' + d.getMinutes()).slice(-2) +
        ':' +
        ('0' + d.getSeconds()).slice(-2) +
        '.' +
        ('0' + Math.floor((d.getMilliseconds() / 1000) * 10)) +
        '  ' +
        ('000' + (loggerSys.memoryUsage() / 1000000).toFixed(1)).slice(-6) +
        'MB' +
        '  ' +
        prefix +
        '  ' +
        msg.join(', ');

      writeLogQueue.push(log);
    }
  };

  const writeLogs = (append: boolean) => {
    if (logFilePath) {
      try {
        queueWriteLog('F', ['--------------------------------------']);
        loggerSys.writeLogs(logFilePath, writeLogQueue.join('\n'), append);
      } catch (e) {}
    }

    writeLogQueue.length = 0;
  };

  const red = (msg: string) => loggerSys.color(msg, 'red');
  const green = (msg: string) => loggerSys.color(msg, 'green');
  const yellow = (msg: string) => loggerSys.color(msg, 'yellow');
  const blue = (msg: string) => loggerSys.color(msg, 'blue');
  const magenta = (msg: string) => loggerSys.color(msg, 'magenta');
  const cyan = (msg: string) => loggerSys.color(msg, 'cyan');
  const gray = (msg: string) => loggerSys.color(msg, 'gray');
  const bold = (msg: string) => loggerSys.color(msg, 'bold');
  const dim = (msg: string) => loggerSys.color(msg, 'dim');
  const bgRed = (msg: string) => loggerSys.color(msg, 'bgRed');

  const shouldLog = (logLevel: string): boolean => {
    return LOG_LEVELS.indexOf(logLevel) >= LOG_LEVELS.indexOf(level);
  };

  const printDiagnostics = (diagnostics: Diagnostic[], cwd?: string) => {
    if (!diagnostics || diagnostics.length === 0) return;

    let outputLines: string[] = [''];

    diagnostics.forEach(d => {
      outputLines = outputLines.concat(printDiagnostic(d, cwd));
    });

    console.log(outputLines.join('\n'));
  };

  const printDiagnostic = (diagnostic: Diagnostic, cwd?: string) => {
    const outputLines = wordWrap([diagnostic.messageText], loggerSys.getColumns());

    let header = '';

    if (diagnostic.header && diagnostic.header !== 'Build Error') {
      header += diagnostic.header;
    }

    if (typeof diagnostic.absFilePath === 'string' && typeof diagnostic.relFilePath !== 'string') {
      if (typeof cwd !== 'string') {
        cwd = loggerSys.cwd();
      }

      diagnostic.relFilePath = loggerSys.relativePath(cwd, diagnostic.absFilePath);
      if (!diagnostic.relFilePath.includes('/')) {
        diagnostic.relFilePath = './' + diagnostic.relFilePath;
      }
    }

    let filePath = diagnostic.relFilePath;
    if (typeof filePath !== 'string') {
      filePath = diagnostic.absFilePath;
    }

    if (typeof filePath === 'string') {
      if (header.length > 0) {
        header += ': ';
      }

      header += cyan(filePath);

      if (typeof diagnostic.lineNumber === 'number' && diagnostic.lineNumber > -1) {
        header += dim(`:`);
        header += yellow(`${diagnostic.lineNumber}`);

        if (typeof diagnostic.columnNumber === 'number' && diagnostic.columnNumber > -1) {
          header += dim(`:`);
          header += yellow(`${diagnostic.columnNumber}`);
        }
      }
    }

    if (header.length > 0) {
      outputLines.unshift(INDENT + header);
    }

    outputLines.push('');

    if (diagnostic.lines && diagnostic.lines.length) {
      const lines = prepareLines(diagnostic.lines);

      lines.forEach(l => {
        if (!isMeaningfulLine(l.text)) {
          return;
        }

        let msg = ``;

        if (l.lineNumber > -1) {
          msg = `L${l.lineNumber}:  `;
        }

        while (msg.length < INDENT.length) {
          msg = ' ' + msg;
        }

        let text = l.text;
        if (l.errorCharStart > -1) {
          text = highlightError(text, l.errorCharStart, l.errorLength);
        }

        msg = dim(msg);

        if (diagnostic.language === 'typescript' || diagnostic.language === 'javascript') {
          msg += javaScriptSyntaxHighlight(text);
        } else if (diagnostic.language === 'scss' || diagnostic.language === 'css') {
          msg += cssSyntaxHighlight(text);
        } else {
          msg += text;
        }

        outputLines.push(msg);
      });

      outputLines.push('');
    }

    if (diagnostic.level === 'error') {
      errorPrefix(outputLines);
    } else if (diagnostic.level === 'warn') {
      warnPrefix(outputLines);
    } else if (diagnostic.level === 'debug') {
      debugPrefix(outputLines);
    } else {
      infoPrefix(outputLines);
    }

    if (diagnostic.debugText != null && level === 'debug') {
      outputLines.push(diagnostic.debugText);
      debugPrefix(wordWrap([diagnostic.debugText], loggerSys.getColumns()));
    }

    return outputLines;
  };

  const highlightError = (errorLine: string, errorCharStart: number, errorLength: number) => {
    let rightSideChars = errorLine.length - errorCharStart + errorLength - 1;
    while (errorLine.length + INDENT.length > loggerSys.getColumns()) {
      if (errorCharStart > errorLine.length - errorCharStart + errorLength && errorCharStart > 5) {
        // larger on left side
        errorLine = errorLine.substr(1);
        errorCharStart--;
      } else if (rightSideChars > 1) {
        // larger on right side
        errorLine = errorLine.substr(0, errorLine.length - 1);
        rightSideChars--;
      } else {
        break;
      }
    }

    const lineChars: string[] = [];
    const lineLength = Math.max(errorLine.length, errorCharStart + errorLength);
    for (var i = 0; i < lineLength; i++) {
      var chr = errorLine.charAt(i);
      if (i >= errorCharStart && i < errorCharStart + errorLength) {
        chr = bgRed(chr === '' ? ' ' : chr);
      }
      lineChars.push(chr);
    }

    return lineChars.join('');
  };

  const javaScriptSyntaxHighlight = (text: string) => {
    if (text.trim().startsWith('//')) {
      return dim(text);
    }

    const words = text.split(' ').map(word => {
      if (JS_KEYWORDS.indexOf(word) > -1) {
        return cyan(word);
      }
      return word;
    });

    return words.join(' ');
  };

  const cssSyntaxHighlight = (text: string) => {
    let cssProp = true;
    const safeChars = 'abcdefghijklmnopqrstuvwxyz-_';
    const notProp = '.#,:}@$[]/*';

    const chars: string[] = [];

    for (var i = 0; i < text.length; i++) {
      const c = text.charAt(i);

      if (c === ';' || c === '{') {
        cssProp = true;
      } else if (notProp.indexOf(c) > -1) {
        cssProp = false;
      }
      if (cssProp && safeChars.indexOf(c.toLowerCase()) > -1) {
        chars.push(cyan(c));
        continue;
      }

      chars.push(c);
    }

    return chars.join('');
  };

  const logger: Logger = {
    enableColors: loggerSys.enableColors,
    emoji: loggerSys.emoji,
    getLevel,
    setLevel,
    debug,
    info,
    warn,
    error,
    createTimeSpan,
    printDiagnostics,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    gray,
    bold,
    dim,
    bgRed,
    setLogFilePath,
    writeLogs,
  };
  return logger;
};

export interface TerminalLoggerSys {
  color: (msg: string, colorName: ColorType) => string;
  emoji: (msg: string) => string;
  enableColors: (useColors: boolean) => void;
  cwd: () => string;
  getColumns: () => number;
  memoryUsage: () => number;
  relativePath: (from: string, to: string) => string;
  writeLogs: (logFilePath: string, log: string, append: boolean) => void;
}

export type ColorType = 'bgRed' | 'blue' | 'bold' | 'cyan' | 'dim' | 'gray' | 'green' | 'magenta' | 'red' | 'yellow';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

export const wordWrap = (msg: any[], columns: number) => {
  const lines: string[] = [];
  const words: any[] = [];

  msg.forEach(m => {
    if (m === null) {
      words.push('null');
    } else if (typeof m === 'undefined') {
      words.push('undefined');
    } else if (typeof m === 'string') {
      m.replace(/\s/gm, ' ')
        .split(' ')
        .forEach(strWord => {
          if (strWord.trim().length) {
            words.push(strWord.trim());
          }
        });
    } else if (typeof m === 'number' || typeof m === 'boolean' || typeof m === 'function') {
      words.push(m.toString());
    } else if (Array.isArray(m)) {
      words.push(() => {
        return m.toString();
      });
    } else if (Object(m) === m) {
      words.push(() => {
        return m.toString();
      });
    } else {
      words.push(m.toString());
    }
  });

  let line = INDENT;
  words.forEach(word => {
    if (lines.length > 25) {
      return;
    }

    if (typeof word === 'function') {
      if (line.trim().length) {
        lines.push(line);
      }
      lines.push(word());
      line = INDENT;
    } else if (INDENT.length + word.length > columns - 1) {
      // word is too long to play nice, just give it its own line
      if (line.trim().length) {
        lines.push(line);
      }
      lines.push(INDENT + word);
      line = INDENT;
    } else if (word.length + line.length > columns - 1) {
      // this word would make the line too long
      // print the line now, then start a new one
      lines.push(line);
      line = INDENT + word + ' ';
    } else {
      line += word + ' ';
    }
  });

  if (line.trim().length) {
    lines.push(line);
  }

  return lines.map(line => {
    return (line as any).trimRight();
  });
};

const prepareLines = (orgLines: PrintLine[]) => {
  const lines: PrintLine[] = JSON.parse(JSON.stringify(orgLines));

  for (let i = 0; i < 100; i++) {
    if (!eachLineHasLeadingWhitespace(lines)) {
      return lines;
    }
    for (let i = 0; i < lines.length; i++) {
      lines[i].text = lines[i].text.substr(1);
      lines[i].errorCharStart--;
      if (!lines[i].text.length) {
        return lines;
      }
    }
  }

  return lines;
};

const eachLineHasLeadingWhitespace = (lines: PrintLine[]) => {
  if (!lines.length) {
    return false;
  }

  for (var i = 0; i < lines.length; i++) {
    if (!lines[i].text || lines[i].text.length < 1) {
      return false;
    }
    const firstChar = lines[i].text.charAt(0);
    if (firstChar !== ' ' && firstChar !== '\t') {
      return false;
    }
  }

  return true;
};

const isMeaningfulLine = (line: string) => {
  if (line) {
    line = line.trim();
    return line.length > 0;
  }
  return false;
};

const JS_KEYWORDS = [
  'abstract',
  'any',
  'as',
  'break',
  'boolean',
  'case',
  'catch',
  'class',
  'console',
  'const',
  'continue',
  'debugger',
  'declare',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'from',
  'function',
  'get',
  'if',
  'import',
  'in',
  'implements',
  'Infinity',
  'instanceof',
  'let',
  'module',
  'namespace',
  'NaN',
  'new',
  'number',
  'null',
  'public',
  'private',
  'protected',
  'require',
  'return',
  'static',
  'set',
  'string',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'true',
  'type',
  'typeof',
  'undefined',
  'var',
  'void',
  'with',
  'while',
  'yield',
];

const INDENT = '           ';

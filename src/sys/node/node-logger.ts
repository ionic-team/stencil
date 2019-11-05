import * as d from '../../declarations';
import color from 'ansi-colors';
import fs from 'graceful-fs';
import path from 'path';


export class NodeLogger implements d.Logger {
  private _level = 'info';
  private writeLogQueue: string[] = [];
  buildLogFilePath: string = null;

  get level() {
    return this._level;
  }

  set level(l: string) {
    if (typeof l === 'string') {
      l = l.toLowerCase().trim();

      if (LOG_LEVELS.indexOf(l) === -1) {
        this.error(`Invalid log level '${color.bold(l)}' (choose from: ${LOG_LEVELS.map(l => color.bold(l)).join(', ')})`);
      } else {
        this._level = l;
      }
    }
  }

  info(...msg: any[]) {
    if (this.shouldLog('info')) {
      const lines = wordWrap(msg, getColumns());
      this.infoPrefix(lines);
      console.log(lines.join('\n'));
    }
    this.queueWriteLog('I', msg);
  }

  infoPrefix(lines: string[]) {
    if (lines.length) {
      const d = new Date();

      const prefix = '[' +
        ('0' + d.getMinutes()).slice(-2) + ':' +
        ('0' + d.getSeconds()).slice(-2) + '.' +
        Math.floor((d.getMilliseconds() / 1000) * 10) + ']';

      lines[0] = this.dim(prefix) + lines[0].substr(prefix.length);
    }
  }

  warn(...msg: any[]) {
    if (this.shouldLog('warn')) {
      const lines = wordWrap(msg, getColumns());
      this.warnPrefix(lines);
      console.warn('\n' + lines.join('\n') + '\n');
    }
    this.queueWriteLog('W', msg);
  }

  warnPrefix(lines: string[]) {
    if (lines.length) {
      const prefix = '[ WARN  ]';
      lines[0] = this.bold(color.yellow(prefix)) + lines[0].substr(prefix.length);
    }
  }

  error(...msg: any[]) {
    for (let i = 0; i < msg.length; i++) {
      if (msg[i] instanceof Error) {
        const err: Error = msg[i];
        msg[i] = err.message;
        if (err.stack) {
          msg[i] += '\n' + err.stack;
        }
      }
    }

    if (this.shouldLog('error')) {
      const lines = wordWrap(msg, getColumns());
      this.errorPrefix(lines);
      console.error('\n' + lines.join('\n') + '\n');
    }
    this.queueWriteLog('E', msg);
  }

  errorPrefix(lines: string[]) {
    if (lines.length) {
      const prefix = '[ ERROR ]';
      lines[0] = this.bold(color.red(prefix)) + lines[0].substr(prefix.length);
    }
  }

  debug(...msg: any[]) {
    if (this.shouldLog('debug')) {
      msg.push(this.dim(` MEM: ${(process.memoryUsage().rss / 1000000).toFixed(1)}MB`));
      const lines = wordWrap(msg, getColumns());
      this.debugPrefix(lines);
      console.log(lines.join('\n'));
    }
    this.queueWriteLog('D', msg);
  }

  debugPrefix(lines: string[]) {
    if (lines.length) {
      const d = new Date();

      const prefix = '[' +
        ('0' + d.getMinutes()).slice(-2) + ':' +
        ('0' + d.getSeconds()).slice(-2) + '.' +
        Math.floor((d.getMilliseconds() / 1000) * 10) + ']';

      lines[0] = color.cyan(prefix) + lines[0].substr(prefix.length);
    }
  }

  timespanStart(startMsg: string, debug: boolean, appendTo: string[]) {
    const msg = [`${startMsg} ${this.dim('...')}`];

    if (debug) {
      if (this.shouldLog('debug')) {
        msg.push(this.dim(` MEM: ${(process.memoryUsage().rss / 1000000).toFixed(1)}MB`));
        const lines = wordWrap(msg, getColumns());
        this.debugPrefix(lines);
        console.log(lines.join('\n'));
        this.queueWriteLog('D', [`${startMsg} ...`]);
      }

    } else {
      const lines = wordWrap(msg, getColumns());
      this.infoPrefix(lines);
      console.log(lines.join('\n'));
      this.queueWriteLog('I', [`${startMsg} ...`]);
      if (appendTo) {
        appendTo.push(`${startMsg} ...`);
      }
    }
  }

  timespanFinish(finishMsg: string, timeSuffix: string, color: 'red', bold: boolean, newLineSuffix: boolean, debug: boolean, appendTo: string[]) {
    let msg = finishMsg;

    if (color) {
      msg = this.color(finishMsg, color);
    }
    if (bold) {
      msg = this.bold(msg);
    }

    msg += ' ' + this.dim(timeSuffix);

    if (debug) {
      if (this.shouldLog('debug')) {
        const m = [msg];
        m.push(this.dim(` MEM: ${(process.memoryUsage().rss / 1000000).toFixed(1)}MB`));
        const lines = wordWrap(m, getColumns());
        this.debugPrefix(lines);
        console.log(lines.join('\n'));
      }
      this.queueWriteLog('D', [`${finishMsg} ${timeSuffix}`]);

    } else {
      const lines = wordWrap([msg], getColumns());
      this.infoPrefix(lines);
      console.log(lines.join('\n'));
      this.queueWriteLog('I', [`${finishMsg} ${timeSuffix}`]);

      if (appendTo) {
        appendTo.push(`${finishMsg} ${timeSuffix}`);
      }
    }

    if (newLineSuffix) {
      console.log('');
    }
  }

  private queueWriteLog(prefix: string, msg: any[]) {
    if (this.buildLogFilePath) {
      const d = new Date();
      const log = '' +
        ('0' + d.getHours()).slice(-2) + ':' +
        ('0' + d.getMinutes()).slice(-2) + ':' +
        ('0' + d.getSeconds()).slice(-2) + '.' +
        ('0' + Math.floor((d.getMilliseconds() / 1000) * 10)) +
        '  ' +
        ('000' + (process.memoryUsage().rss / 1000000).toFixed(1)).slice(-6) + 'MB' +
        '  ' + prefix +
        '  ' +
        msg.join(', ');

      this.writeLogQueue.push(log);
    }
  }

  writeLogs(append: boolean) {
    if (this.buildLogFilePath) {
      try {
        this.queueWriteLog('F', ['--------------------------------------']);

        const log = this.writeLogQueue.join('\n');

        if (append) {
          try {
            fs.accessSync(this.buildLogFilePath);
          } catch (e) {
            append = false;
          }
        }

        if (append) {
          fs.appendFileSync(this.buildLogFilePath, log);
        } else {
          fs.writeFileSync(this.buildLogFilePath, log);
        }

      } catch (e) {}
    }

    this.writeLogQueue.length = 0;
  }

  color(msg: string, colorName: 'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'gray') {
    return (color as any)[colorName](msg);
  }

  red(msg: string) {
    return color.red(msg);
  }

  green(msg: string) {
    return color.green(msg);
  }

  yellow(msg: string) {
    return color.yellow(msg);
  }

  blue(msg: string) {
    return color.blue(msg);
  }

  magenta(msg: string) {
    return color.magenta(msg);
  }

  cyan(msg: string) {
    return color.cyan(msg);
  }

  gray(msg: string) {
    return color.gray(msg);
  }

  bold(msg: string) {
    return color.bold(msg);
  }

  dim(msg: string) {
    return color.dim(msg);
  }

  private shouldLog(level: string): boolean {
    return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.level);
  }

  createTimeSpan(startMsg: string, debug = false, appendTo?: string[]): d.LoggerTimeSpan {
    return new CmdTimeSpan(this, startMsg, debug, appendTo);
  }

  printDiagnostics(diagnostics: d.Diagnostic[], cwd?: string) {
    if (!diagnostics || diagnostics.length === 0) return;

    let outputLines: string[] = [''];

    diagnostics.forEach(d => {
      outputLines = outputLines.concat(this.printDiagnostic(d, cwd));
    });

    console.log(outputLines.join('\n'));
  }

  printDiagnostic(diagnostic: d.Diagnostic, cwd?: string) {
    const outputLines = wordWrap([diagnostic.messageText], getColumns());

    let header = '';

    if (diagnostic.header && diagnostic.header !== 'Build Error') {
      header += diagnostic.header;
    }

    if (typeof diagnostic.absFilePath === 'string' && typeof diagnostic.relFilePath !== 'string') {
      if (typeof cwd !== 'string') {
        cwd = process.cwd();
      }

      diagnostic.relFilePath = path.relative(cwd, diagnostic.absFilePath);
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

      header += color.cyan(filePath);

      if (typeof diagnostic.lineNumber === 'number' && diagnostic.lineNumber > -1) {
        header += color.dim(`:`);
        header += color.yellow(`${diagnostic.lineNumber}`);

        if (typeof diagnostic.columnNumber === 'number' && diagnostic.columnNumber > -1) {
          header += color.dim(`:`);
          header += color.yellow(`${diagnostic.columnNumber}`);
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
          text = this.highlightError(text, l.errorCharStart, l.errorLength);
        }

        msg = this.dim(msg);

        if (diagnostic.language === 'typescript' || diagnostic.language === 'javascript') {
          msg += this.javaScriptSyntaxHighlight(text);
        } else if (diagnostic.language === 'scss' || diagnostic.language === 'css') {
          msg += this.cssSyntaxHighlight(text);
        } else {
          msg += text;
        }

        outputLines.push(msg);
      });

      outputLines.push('');
    }

    if (diagnostic.level === 'error') {
      this.errorPrefix(outputLines);

    } else if (diagnostic.level === 'warn') {
      this.warnPrefix(outputLines);

    } else if (diagnostic.level === 'debug') {
      this.debugPrefix(outputLines);

    } else {
      this.infoPrefix(outputLines);
    }

    if (diagnostic.debugText != null && this.level === 'debug') {
      outputLines.push(diagnostic.debugText);
      this.debugPrefix(wordWrap([diagnostic.debugText], getColumns()));
    }

    return outputLines;
  }

  highlightError(errorLine: string, errorCharStart: number, errorLength: number) {
    let rightSideChars = errorLine.length - errorCharStart + errorLength - 1;
    while (errorLine.length + INDENT.length > MAX_COLUMNS) {
      if (errorCharStart > (errorLine.length - errorCharStart + errorLength) && errorCharStart > 5) {
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
        chr = color.bgRed(chr === '' ? ' ' : chr);
      }
      lineChars.push(chr);
    }

    return lineChars.join('');
  }

  javaScriptSyntaxHighlight(text: string) {
    if (text.trim().startsWith('//')) {
      return this.dim(text);
    }

    const words = text.split(' ').map(word => {
      if (JS_KEYWORDS.indexOf(word) > -1) {
        return color.cyan(word);
      }
      return word;
    });

    return words.join(' ');
  }

  cssSyntaxHighlight(text: string) {
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
        chars.push(color.cyan(c));
        continue;
      }

      chars.push(c);
    }

    return chars.join('');
  }
}


class CmdTimeSpan {
  private logger: NodeLogger;
  private start: number;

  constructor(
    logger: NodeLogger,
    startMsg: string,
    private debug: boolean,
    private appendTo: string[]
  ) {
    this.logger = logger;
    this.start = Date.now();
    this.logger.timespanStart(startMsg, debug, this.appendTo);
  }

  duration() {
    return Date.now() - this.start;
  }

  finish(msg: string, color?: 'red', bold?: boolean, newLineSuffix?: boolean) {
    const duration = this.duration();
    let time: string;

    if (duration > 1000) {
      time = 'in ' + (duration / 1000).toFixed(2) + ' s';

    } else {
      const ms = parseFloat((duration).toFixed(3));
      if (ms > 0) {
        time = 'in ' + duration + ' ms';
      } else {
        time = 'in less than 1 ms';
      }
    }

    this.logger.timespanFinish(
      msg,
      time,
      color,
      bold,
      newLineSuffix,
      this.debug,
      this.appendTo
    );

    return duration;
  }

}


const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];


function getColumns() {
  const terminalWidth = (process.stdout && (process.stdout as any).columns) || 80;
  return Math.max(Math.min(MAX_COLUMNS, terminalWidth), MIN_COLUMNS);
}


export function wordWrap(msg: any[], columns: number) {
  const lines: string[] = [];
  const words: any[] = [];

  msg.forEach(m => {
    if (m === null) {
      words.push('null');

    } else if (typeof m === 'undefined') {
      words.push('undefined');

    } else if (typeof m === 'string') {
      m.replace(/\s/gm, ' ').split(' ').forEach(strWord => {
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

    } else if ((word.length + line.length) > columns - 1) {
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
}


function prepareLines(orgLines: d.PrintLine[]) {
  const lines: d.PrintLine[] = JSON.parse(JSON.stringify(orgLines));

  for (let i = 0; i < 100; i++) {
    if (!eachLineHasLeadingWhitespace(lines)) {
      return lines;
    }
    for (let i = 0; i < lines.length; i++) {
      lines[i].text = lines[i].text.substr(1);
      lines[i].errorCharStart--;
      if (!(lines[i]).text.length) {
        return lines;
      }
    }
  }

  return lines;
}


function eachLineHasLeadingWhitespace(lines: d.PrintLine[]) {
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
}


function isMeaningfulLine(line: string) {
  if (line) {
    line = line.trim();
    return line.length > 0;
  }
  return false;
}


const JS_KEYWORDS = [
  'abstract', 'any', 'as', 'break', 'boolean', 'case', 'catch', 'class',
  'console', 'const', 'continue', 'debugger', 'declare', 'default', 'delete',
  'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from',
  'function', 'get', 'if', 'import', 'in', 'implements', 'Infinity',
  'instanceof', 'let', 'module', 'namespace', 'NaN', 'new', 'number', 'null',
  'public', 'private', 'protected', 'require', 'return', 'static', 'set',
  'string', 'super', 'switch', 'this', 'throw', 'try', 'true', 'type',
  'typeof', 'undefined', 'var', 'void', 'with', 'while', 'yield',
];


const INDENT = '           ';
const MIN_COLUMNS = 60;
const MAX_COLUMNS = 120;

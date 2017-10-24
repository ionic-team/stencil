import { Diagnostic, Logger, LoggerTimeSpan, PrintLine } from '../interfaces';
import { Chalk } from 'chalk';


export class NodeLogger implements Logger {
  private _level = 'info';
  private process: NodeJS.Process;
  private chalk: Chalk;

  constructor(opts: { level?: string, process: NodeJS.Process }) {
    this.process = opts.process;
    this.level = opts.level;

    const sysUtil = require('./sys-util.js');
    this.chalk = sysUtil.chalk;
  }

  get level() {
    return this._level;
  }

  set level(l: string) {
    if (typeof l === 'string') {
      l = l.toLowerCase().trim();

      if (LOG_LEVELS.indexOf(l) === -1) {
        this.error(`Invalid log level '${this.chalk.bold(l)}' (choose from: ${LOG_LEVELS.map(l => this.chalk.bold(l)).join(', ')})`);
      } else {
        this._level = l;
      }
    }
  }

  info(...msg: any[]) {
    if (this.shouldLog('info')) {
      const lines = wordWrap(msg);
      this.infoPrefix(lines);
      console.log(lines.join('\n'));
    }
  }

  infoPrefix(lines: string[]) {
    if (lines.length) {
      const d = new Date();

      let prefix = '[' +
        ('0' + d.getMinutes()).slice(-2) + ':' +
        ('0' + d.getSeconds()).slice(-2) + '.' +
        Math.floor((d.getMilliseconds() / 1000) * 10) + ']';

      lines[0] = this.dim(prefix) + lines[0].substr(prefix.length);
    }
  }

  warn(...msg: any[]) {
    if (this.shouldLog('warn')) {
      const lines = wordWrap(msg);
      this.warnPrefix(lines);
      console.warn(lines.join('\n'));
    }
  }

  warnPrefix(lines: string[]) {
    if (lines.length) {
      let prefix = '[ WARN  ]';
      lines[0] = this.bold(this.chalk.yellow(prefix)) + lines[0].substr(prefix.length);
    }
  }

  error(...msg: any[]) {
    if (this.shouldLog('error')) {
      const lines = wordWrap(msg);
      this.errorPrefix(lines);
      console.error(lines.join('\n'));
    }
  }

  errorPrefix(lines: string[]) {
    if (lines.length) {
      let prefix = '[ ERROR ]';
      lines[0] = this.bold(this.chalk.red(prefix)) + lines[0].substr(prefix.length);
    }
  }

  debug(...msg: any[]) {
    if (this.shouldLog('debug')) {
      msg.push(this.memoryUsage());
      const lines = wordWrap(msg);
      this.debugPrefix(lines);
      console.log(lines.join('\n'));
    }
  }

  debugPrefix(lines: string[]) {
    if (lines.length) {
      let prefix = '[ DEBUG ]';
      lines[0] = this.chalk.cyan(prefix) + lines[0].substr(prefix.length);
    }
  }

  color(msg: string, color: 'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'gray') {
    return (this.chalk as any)[color](msg);
  }

  red(msg: string) {
    return this.chalk.red(msg);
  }

  green(msg: string) {
    return this.chalk.green(msg);
  }

  yellow(msg: string) {
    return this.chalk.yellow(msg);
  }

  blue(msg: string) {
    return this.chalk.blue(msg);
  }

  magenta(msg: string) {
    return this.chalk.magenta(msg);
  }

  cyan(msg: string) {
    return this.chalk.cyan(msg);
  }

  gray(msg: string) {
    return this.chalk.gray(msg);
  }

  bold(msg: string) {
    return this.chalk.bold(msg);
  }

  dim(msg: string) {
    return this.chalk.dim(msg);
  }

  memoryUsage() {
    return this.dim(` MEM: ${(this.process.memoryUsage().rss / 1000000).toFixed(1)}MB`);
  }

  private shouldLog(level: string): boolean {
    return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.level);
  }

  createTimeSpan(startMsg: string, debug = false): LoggerTimeSpan {
    return new CmdTimeSpan(this, startMsg, debug);
  }

  printDiagnostics(diagnostics: Diagnostic[]) {
    if (!diagnostics || !diagnostics.length) return;

    let outputLines: string[] = [''];

    diagnostics.forEach(d => {
      outputLines = outputLines.concat(this.printDiagnostic(d));
    });

    console.log(outputLines.join('\n'));
  }

  printDiagnostic(d: Diagnostic) {
    const outputLines = wordWrap([d.messageText]);

    if (d.header && d.header !== 'build error' && d.header !== 'build warn') {
      outputLines.unshift(INDENT + d.header);
    }

    outputLines.push('');

    if (d.lines && d.lines.length) {
      const lines = prepareLines(d.lines, 'text');

      lines.forEach(l => {
        if (!isMeaningfulLine(l.text)) {
          return;
        }

        let msg = `L${l.lineNumber}:  `;
        while (msg.length < INDENT.length) {
          msg = ' ' + msg;
        }

        let text = l.text;
        if (l.errorCharStart > -1) {
          text = this.highlightError(text, l.errorCharStart, l.errorLength);
        }

        msg = this.dim(msg);

        if (d.language === 'javascript') {
          msg += this.jsSyntaxHighlight(text);
        } else if (d.language === 'scss' || d.language === 'css') {
          msg += this.cssSyntaxHighlight(text);
        } else {
          msg += text;
        }

        outputLines.push(msg);
      });

      outputLines.push('');
    }

    if (d.level === 'warn') {
      this.warnPrefix(outputLines);

    } else if (d.level === 'info') {
      this.infoPrefix(outputLines);

    } else {
      this.errorPrefix(outputLines);
    }

    return outputLines;
  }

  highlightError(errorLine: string, errorCharStart: number, errorLength: number) {
    let rightSideChars = errorLine.length - errorCharStart + errorLength - 1;
    while (errorLine.length + INDENT.length > MAX_LEN) {
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
        chr = this.chalk.bgRed(chr === '' ? ' ' : chr);
      }
      lineChars.push(chr);
    }

    return lineChars.join('');
  }

  jsSyntaxHighlight(text: string) {
    if (text.trim().startsWith('//')) {
      return this.dim(text);
    }

    const words = text.split(' ').map(word => {
      if (JS_KEYWORDS.indexOf(word) > -1) {
        return this.chalk.cyan(word);
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
      var c = text.charAt(i);

      if (c === ';' || c === '{') {
        cssProp = true;
      } else if (notProp.indexOf(c) > -1) {
        cssProp = false;
      }
      if (cssProp && safeChars.indexOf(c.toLowerCase()) > -1) {
        chars.push(this.chalk.cyan(c));
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
    private debug: boolean
  ) {
    this.logger = logger;
    this.start = Date.now();
    let msg = `${startMsg} ${logger.dim('...')}`;

    if (this.debug) {
      this.logger.debug(msg);
    } else {
      this.logger.info(msg);
    }
  }

  finish(msg: string, color?: 'red', bold?: boolean, newLineSuffix?: boolean) {
    if (color) {
      msg = this.logger.color(msg, color);
    }
    if (bold) {
      msg = this.logger.bold(msg);
    }

    msg += ' ' + this.logger.dim(this.timeSuffix());

    if (this.debug) {
      this.logger.debug(msg);
    } else {
      this.logger.info(msg);
    }

    if (newLineSuffix) {
      console.log('');
    }
  }

  private timeSuffix() {
    const duration = Date.now() - this.start;
    let time: string;

    if (duration > 1000) {
      time = 'in ' + (duration / 1000).toFixed(2) + ' s';

    } else {
      let ms = parseFloat((duration).toFixed(3));
      if (ms > 0) {
        time = 'in ' + duration + ' ms';
      } else {
        time = 'in less than 1 ms';
      }
    }

    return time;
  }

}


const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];


function wordWrap(msg: any[]) {
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

    } else if (INDENT.length + word.length > MAX_LEN) {
      // word is too long to play nice, just give it its own line
      if (line.trim().length) {
        lines.push(line);
      }
      lines.push(INDENT + word);
      line = INDENT;

    } else if ((word.length + line.length) > MAX_LEN) {
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

  return lines;
}


function prepareLines(orgLines: PrintLine[], code: 'text'|'html') {
  const lines: PrintLine[] = JSON.parse(JSON.stringify(orgLines));

  for (let i = 0; i < 100; i++) {
    if (!eachLineHasLeadingWhitespace(lines, code)) {
      return lines;
    }
    for (let i = 0; i < lines.length; i++) {
      (<any>lines[i])[code] = (<any>lines[i])[code].substr(1);
      lines[i].errorCharStart--;
      if (!(<any>lines[i])[code].length) {
        return lines;
      }
    }
  }

  return lines;
}


function eachLineHasLeadingWhitespace(lines: PrintLine[], code: 'text'|'html') {
  if (!lines.length) {
    return false;
  }
  for (var i = 0; i < lines.length; i++) {
    if ( !(<any>lines[i])[code] || (<any>lines[i])[code].length < 1) {
      return false;
    }
    var firstChar = (<any>lines[i])[code].charAt(0);
    if (firstChar !== ' ' && firstChar !== '\t') {
      return false;
    }
  }
  return true;
}


function isMeaningfulLine(line: string) {
  if (line) {
    line = line.trim();
    if (line.length) {
      return (MEH_LINES.indexOf(line) < 0);
    }
  }
  return false;
}

const MEH_LINES = [';', ':', '{', '}', '(', ')', '/**', '/*', '*/', '*', '({', '})'];


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
const MAX_LEN = 120;

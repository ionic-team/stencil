import { TranspileOptions } from './interfaces';
import { Diagnostic, PrintLine } from './interfaces';
import * as ts from 'typescript';


export class Logger {
  private start: number;
  private scope: string;

  constructor(private opt: TranspileOptions, scope: string) {
    this.start = Date.now();
    this.scope = scope;
    let msg = `${scope} started ...`;
    if (opt.debugMode) {
      msg += memoryUsage();
    }
    Logger.info(msg);
  }

  ready() {
    this.completed('ready');
  }

  finish() {
    this.completed('finished');
  }

  private completed(type: string) {
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

    let msg = `${this.scope} ${type} ${time}`;

    if (this.opt.debugMode) {
      msg += memoryUsage();
    }

    Logger.info(msg);
  }

  fail(err: Error) {
    if (err) {
      if (err instanceof BuildError) {
        let failedMsg = `${this.scope} failed`;
        if (err.message) {
          failedMsg += `: ${err.message}`;
        }

        if (!err.hasBeenLogged) {
          Logger.error(`${failedMsg}`);

          err.hasBeenLogged = true;

          if (err.stack && this.opt.debugMode) {
            Logger.debug(err.stack);
          }

        } else if (this.opt.debugMode) {
          Logger.debug(`${failedMsg}`);
        }
        return err;
      }
    }

    return err;
  }

  setStartTime(startTime: number) {
    this.start = startTime;
  }

  /**
   * Does not print out a time prefix or color any text. Only prefix
   * with whitespace so the message is lined up with timestamped logs.
   */
  static log(...msg: any[]) {
    Logger.wordWrap(msg).forEach(line => {
      console.log(line);
    });
  }

  /**
   * Prints out a dim colored timestamp prefix, with optional color
   * and bold message.
   */
  static info(msg: string) {
    const lines = Logger.wordWrap([msg]);
    if (lines.length) {
      let prefix = timePrefix();
      let lineOneMsg = lines[0].substr(prefix.length);
      lines[0] = prefix + lineOneMsg;
    }
    lines.forEach(line => {
      console.log(line);
    });
  }

  /**
   * Prints out a yellow colored timestamp prefix.
   */
  static warn(...msg: any[]) {
    const lines = Logger.wordWrap(msg);
    if (lines.length) {
      let prefix = timePrefix();
      lines[0] = prefix + lines[0].substr(prefix.length);
    }
    lines.forEach(line => {
      console.warn(line);
    });
  }

  /**
   * Prints out a error colored timestamp prefix.
   */
  static error(...msg: any[]) {
    const lines = Logger.wordWrap(msg);
    if (lines.length) {
      let prefix = timePrefix();
      lines[0] = prefix + lines[0].substr(prefix.length);
    }
    lines.forEach(line => {
      console.error(line);
    });
  }

  /**
   * Prints out a blue colored DEBUG prefix. Only prints out when debug mode.
   */
  static debug(opt: TranspileOptions, ...msg: any[]) {
    if (opt.debugMode) {
      msg.push(memoryUsage());

      const lines = Logger.wordWrap(msg);
      if (lines.length) {
        let prefix = '[ DEBUG! ]';
        lines[0] = prefix + lines[0].substr(prefix.length);
      }
      lines.forEach(line => {
        console.log(line);
      });
    }
  }

  static wordWrap(msg: any[]) {
    const output: string[] = [];

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

      } else if (typeof m === 'number' || typeof m === 'boolean') {
        words.push(m.toString());

      } else if (typeof m === 'function') {
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

    let line = Logger.INDENT;
    words.forEach(word => {
      if (typeof word === 'function') {
        if (line.trim().length) {
          output.push(line);
        }
        output.push(word());
        line = Logger.INDENT;

      } else if (Logger.INDENT.length + word.length > Logger.MAX_LEN) {
        // word is too long to play nice, just give it its own line
        if (line.trim().length) {
          output.push(line);
        }
        output.push(Logger.INDENT + word);
        line = Logger.INDENT;

      } else if ((word.length + line.length) > Logger.MAX_LEN) {
        // this word would make the line too long
        // print the line now, then start a new one
        output.push(line);
        line = Logger.INDENT + word + ' ';

      } else {
        line += word + ' ';
      }
    });
    if (line.trim().length) {
      output.push(line);
    }
    return output;
  }


  static formatFileName(rootDir: string, fileName: string) {
    fileName = fileName.replace(rootDir, '');
    if (/\/|\\/.test(fileName.charAt(0))) {
      fileName = fileName.substr(1);
    }
    if (fileName.length > 80) {
      fileName = '...' + fileName.substr(fileName.length - 80);
    }
    return fileName;
  }


  static formatHeader(type: string, fileName: string, rootDir: string, startLineNumber: number = null, endLineNumber: number = null) {
    let header = `${type}: ${Logger.formatFileName(rootDir, fileName)}`;

    if (startLineNumber !== null && startLineNumber > 0) {
      if (endLineNumber !== null && endLineNumber > startLineNumber) {
        header += `, lines: ${startLineNumber} - ${endLineNumber}`;
      } else {
        header += `, line: ${startLineNumber}`;
      }
    }

    return header;
  }


  static newLine() {
    console.log('');
  }

  static INDENT = '            ';
  static MAX_LEN = 120;

}


function timePrefix() {
  const date = new Date();
  return '[' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + ']';
}


function memoryUsage() {
  return ` MEM: ${(process.memoryUsage().rss / 1000000).toFixed(1)}MB`;
}

export class BuildError extends Error {
  hasBeenLogged = false;
  isFatal: boolean = false;

  constructor(err?: any) {
    super();
    if (err) {
      if (err.message) {
        this.message = err.message;
      } else if (err) {
        this.message = err;
      }
      if (err.stack) {
        this.stack = err.stack;
      }
      if (err.name) {
        this.name = err.name;
      }
      if (typeof err.hasBeenLogged === 'boolean') {
        this.hasBeenLogged = err.hasBeenLogged;
      }
      if (err.hasOwnProperty('isFatal')) {
        this.isFatal = err.isFatal;
      }
    }
  }

  toJson() {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
      hasBeenLogged: this.hasBeenLogged
    };
  }
}


/**
 * Ok, so formatting overkill, we know. But whatever, it makes for great
 * error reporting within a terminal. So, yeah, let's code it up, shall we?
 */

export function runTypeScriptDiagnostics(opts: TranspileOptions, tsDiagnostics: ts.Diagnostic[]) {
  return tsDiagnostics.map(tsDiagnostic => {
    return loadDiagnostic(opts, tsDiagnostic);
  });
}


function loadDiagnostic(opts: TranspileOptions, tsDiagnostic: ts.Diagnostic) {
  const d: Diagnostic = {
    level: 'error',
    type: 'typescript',
    language: 'typescript',
    header: 'typescript error',
    code: tsDiagnostic.code.toString(),
    messageText: ts.flattenDiagnosticMessageText(tsDiagnostic.messageText, '\n'),
    relFileName: null,
    absFileName: null,
    lines: []
  };

  if (tsDiagnostic.file) {
    d.absFileName = tsDiagnostic.file.fileName;
    d.relFileName = Logger.formatFileName(opts.srcDir, d.absFileName);

    let sourceText = tsDiagnostic.file.getText();
    let srcLines = splitLineBreaks(sourceText);

    const posData = tsDiagnostic.file.getLineAndCharacterOfPosition(tsDiagnostic.start);

    const errorLine: PrintLine = {
      lineIndex: posData.line,
      lineNumber: posData.line + 1,
      text: srcLines[posData.line],
      errorCharStart: posData.character,
      errorLength: Math.max(tsDiagnostic.length, 1)
    };

    d.lines.push(errorLine);

    if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
      errorLine.errorLength = 1;
      errorLine.errorCharStart--;
    }

    d.header =  Logger.formatHeader('typescript', tsDiagnostic.file.fileName, opts.srcDir, errorLine.lineNumber);

    if (errorLine.lineIndex > 0) {
      const previousLine: PrintLine = {
        lineIndex: errorLine.lineIndex - 1,
        lineNumber: errorLine.lineNumber - 1,
        text: srcLines[errorLine.lineIndex - 1],
        errorCharStart: -1,
        errorLength: -1
      };

      d.lines.unshift(previousLine);
    }

    if (errorLine.lineIndex + 1 < srcLines.length) {
      const nextLine: PrintLine = {
        lineIndex: errorLine.lineIndex + 1,
        lineNumber: errorLine.lineNumber + 1,
        text: srcLines[errorLine.lineIndex + 1],
        errorCharStart: -1,
        errorLength: -1
      };

      d.lines.push(nextLine);
    }
  }

  return d;
}

export function splitLineBreaks(sourceText: string) {
  if (!sourceText) return [];
  sourceText = sourceText.replace(/\\r/g, '\n');
  return sourceText.split('\n');
}

export function printDiagnostics(diagnostics: Diagnostic[]) {
  if (diagnostics && diagnostics.length) {
    diagnostics.forEach(consoleLogDiagnostic);
  }
}


function consoleLogDiagnostic(d: Diagnostic) {
  if (d.level === 'warn') {
    Logger.warn(d.header);
  } else {
    Logger.error(d.header);
  }

  Logger.wordWrap([d.messageText]).forEach(m => {
    console.log(m);
  });
  console.log('');

  if (d.lines && d.lines.length) {
    const lines = prepareLines(d.lines, 'text');

    lines.forEach(l => {
      if (!isMeaningfulLine(l.text)) {
        return;
      }

      let msg = `L${l.lineNumber}:  `;
      while (msg.length < Logger.INDENT.length) {
        msg = ' ' + msg;
      }

      msg += l.text;

      console.log(msg);
    });

    console.log('');
  }
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



function prepareLines(orgLines: PrintLine[], code: 'text'|'html') {
  const lines: PrintLine[] = JSON.parse(JSON.stringify(orgLines));

  for (var i = 0; i < 100; i++) {
    if (!eachLineHasLeadingWhitespace(lines, code)) {
      return lines;
    }
    for (var i = 0; i < lines.length; i++) {
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

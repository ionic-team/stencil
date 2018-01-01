import { Diagnostic, Logger, LoggerTimeSpan } from '../../util/interfaces';


export class BrowserLogger implements Logger {
  private _level = 'info';

  constructor(opts: { level?: string } = {}) {
    this.level = opts.level;
  }

  get level() {
    return this._level;
  }

  set level(l: string) {
    if (typeof l === 'string') {
      l = l.toLowerCase().trim();

      if (LOG_LEVELS.indexOf(l) === -1) {
        this.error(`Invalid log level '${l}' (choose from: ${LOG_LEVELS.join(', ')})`);
      } else {
        this._level = l;
      }
    }
  }

  info(...msg: any[]) {
    if (this.shouldLog('info')) {
      console.log(msg);
    }
  }

  warn(...msg: any[]) {
    if (this.shouldLog('warn')) {
      console.warn(msg);
    }
  }

  error(...msg: any[]) {
    if (this.shouldLog('error')) {
      console.error(msg);
    }
  }

  debug(...msg: any[]) {
    if (this.shouldLog('debug')) {
      console.log(msg);
    }
  }


  color(msg: string, _color: 'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'gray') {
    return msg;
  }

  red(msg: string) {
    return msg;
  }

  green(msg: string) {
    return msg;
  }

  yellow(msg: string) {
    return msg;
  }

  blue(msg: string) {
    return msg;
  }

  magenta(msg: string) {
    return msg;
  }

  cyan(msg: string) {
    return msg;
  }

  gray(msg: string) {
    return msg;
  }

  bold(msg: string) {
    return msg;
  }

  dim(msg: string) {
    return msg;
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
    const outputLines = [d.messageText];
    return outputLines;
  }

}


class CmdTimeSpan {
  private logger: BrowserLogger;
  private start: number;

  constructor(
    logger: BrowserLogger,
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

import { Logger, LoggerTimeSpan } from '../interfaces';


export class CmdLogger implements Logger {
  private _level = 'info';
  private process: any;
  private chalk: any;
  private ttyWidth: number;

  constructor(opts: {level: string, process: any, chalk: any}) {
    this.chalk = opts.chalk;
    this.process = opts.process;
    this.ttyWidth = Math.max(MIN_LEN, Math.min(opts.process.stdout.columns || 0, MAX_LEN));
    this.level = opts.level;
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
      if (lines.length) {
        const d = new Date();

        let prefix = '[' +
          ('0' + d.getMinutes()).slice(-2) + ':' +
          ('0' + d.getSeconds()).slice(-2) + '.' +
          Math.floor((d.getMilliseconds() / 1000) * 10) + ']';

        lines[0] = this.dim(prefix) + lines[0].substr(prefix.length);
      }
      lines.forEach(line => {
        console.log(line);
      });
    }
  }

  warn(...msg: any[]) {
    if (this.shouldLog('warn')) {
      const lines = wordWrap(msg);
      if (lines.length) {
        let prefix = '[ WARN  ]';
        lines[0] = this.bold(this.chalk.yellow(prefix)) + lines[0].substr(prefix.length);
      }
      lines.forEach(line => {
        console.warn(line);
      });
    }
  }

  error(...msg: any[]) {
    if (this.shouldLog('error')) {
      const lines = wordWrap(msg);
      if (lines.length) {
        let prefix = '[ ERROR ]';
        lines[0] = this.bold(this.chalk.red(prefix)) + lines[0].substr(prefix.length);
      }
      lines.forEach(line => {
        console.error(line);
      });
    }
  }

  debug(...msg: any[]) {
    if (this.shouldLog('debug')) {
      msg.push(this.memoryUsage());

      const lines = wordWrap(msg);
      if (lines.length) {
        let prefix = '[ DEBUG ]';
        lines[0] = this.chalk.cyan(prefix) + lines[0].substr(prefix.length);
      }
      lines.forEach(line => {
        console.log(line);
      });
    }
  }

  color(msg: string, color: string) {
    return this.chalk[color](msg);
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
}


class CmdTimeSpan {
  private logger: CmdLogger;
  private start: number;

  constructor(
    logger: CmdLogger,
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

  finish(msg: string, color?: string, bold?: boolean, newLineSuffix?: boolean) {
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

  let line = INDENT;
  words.forEach(word => {
    if (typeof word === 'function') {
      if (line.trim().length) {
        output.push(line);
      }
      output.push(word());
      line = INDENT;

    } else if (INDENT.length + word.length > MAX_LEN) {
      // word is too long to play nice, just give it its own line
      if (line.trim().length) {
        output.push(line);
      }
      output.push(INDENT + word);
      line = INDENT;

    } else if ((word.length + line.length) > MAX_LEN) {
      // this word would make the line too long
      // print the line now, then start a new one
      output.push(line);
      line = INDENT + word + ' ';

    } else {
      line += word + ' ';
    }
  });
  if (line.trim().length) {
    output.push(line);
  }
  return output;
}


const INDENT = '           ';
const MIN_LEN = 80;
const MAX_LEN = 120;

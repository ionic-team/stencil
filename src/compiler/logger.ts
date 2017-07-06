import { Logger } from './interfaces';


export class CmdLogger implements Logger {
  private _level = 'info';
  private stream: any;
  private chalk: any;
  private ttyWidth: number;

  constructor(opts: {level: string, stream: any, columns: number, chalk: any}) {
    this.chalk = opts.chalk;
    this.stream = opts.stream;
    this.ttyWidth = Math.max(MIN_TTY_WIDTH, Math.min(opts.columns || 0, MAX_TTY_WIDTH));
    this.level = opts.level;
  }

  get level() {
    return this._level;
  }

  set level(v: string) {
    if (typeof v === 'string') {
      let s = v.toLowerCase().trim();

      if (!isLogLevel(s)) {
        this.error(`Invalid log level '${this.chalk.bold(v)}' (choose from: ${LOG_LEVELS.map(l => this.chalk.bold(l)).join(', ')})`);
        s = 'info';
      }

      this._level = s;
    }
  }

  debug(msg: string) {
    this.log('debug', msg);
  }

  info(msg: string) {
    this.log('info', msg);
  }

  ok(msg: string) {
    this.log('ok', msg);
  }

  warn(msg: string) {
    this.log('warn', msg);
  }

  error(msg: string) {
    this.log('error', msg);
  }

  dim(msg: string) {
    return this.chalk.dim(msg);
  }

  private shouldLog(level: string): boolean {
    return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.level);
  }

  private getStatusColor(level: string) {
    const colors: any = {
      'debug': this.chalk.magenta.dim,
      'info': this.chalk.gray,
      'ok': this.chalk.green,
      'warn': this.chalk.yellow,
      'error': this.chalk.red
    };

    const color = colors[level];

    if (!color) {
      return this.chalk;
    }

    return color;
  }

  private log(level: string, msg: string): void {
    if (this.shouldLog(level) && msg) {

      let prefix = '';
      if (level === 'info') {
        const date = new Date();
        prefix = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);

      } else {
        prefix = ' ' + level.toUpperCase();
        while (prefix.length < 8) {
          prefix += ' ';
        }
      }

      msg = wordWrap(msg.toString(), prefix.length + 4, this.ttyWidth);

      const color = this.getStatusColor(level);
      const statusColor = color.bold.bgBlack;

      this.stream.write(this.dim('[') + statusColor(prefix) + this.dim(']') + '  ' + msg + '\n');
    }
  }

  createTimeSpan(startMsg: string): any {
    return new TimeSpan(this, startMsg);
  }
}


export class TimeSpan {
  private logger: Logger;
  private start: number;

  constructor(logger: Logger, startMsg: string) {
    this.logger = logger;
    this.start = Date.now();
    let msg = `${startMsg} ${logger.dim('...')}`;

    this.logger.info(msg);
  }

  finish(finishMsg: string) {
    let msg = finishMsg;

    msg += ' ' + this.logger.dim(this.timeSuffix());

    this.logger.info(msg);
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


const LOG_LEVELS = ['debug', 'info', 'ok', 'warn', 'error'];


function isLogLevel(l: string) {
  return LOG_LEVELS.indexOf(l) > -1;
}

function wordWrap(msg: string, newLineIndentLength: number, maxWidth: number) {
  msg = msg.replace(/[\r\n]$/, ' ');

  let spacePrefix = '';
  while (spacePrefix.length < newLineIndentLength) {
    spacePrefix += ' ';
  }

  const words = msg.split(' ');

  const lines: string[] = [
    spacePrefix
  ];

  while (words.length) {
    var word = words.shift();

    if (lines[lines.length - 1].length + word.length + 1 > maxWidth) {
      lines.push(spacePrefix + word + ' ');
    } else {
      lines[lines.length - 1] += word + ' ';
    }
  }

  return lines.join('\n').trim();
}


const MIN_TTY_WIDTH = 80;
const MAX_TTY_WIDTH = 120;

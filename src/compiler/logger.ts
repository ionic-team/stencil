import { Logger } from './interfaces';


export class CmdLogger implements Logger {
  private _level: string;
  private stream: any;
  private chalk: any;
  private ttyWidth: number;

  constructor(opts: {level: string, stream: any, columns: number, chalk: any}) {
    this.chalk = opts.chalk;
    this.stream = opts.stream;
    this.ttyWidth = Math.max(MIN_TTY_WIDTH, Math.min(opts.columns || 0, MAX_TTY_WIDTH));
    this.level = opts.level;
  }

  get level(): string {
    return this._level;
  }

  set level(v: string) {
    let s = v.toLowerCase().trim();

    if (!isLogLevel(s)) {
      this.error(`Invalid log level '${this.chalk.bold(v)}' (choose from: ${LOG_LEVELS.map(l => this.chalk.bold(l)).join(', ')})`);
      s = 'info';
    }

    this._level = s;
  }

  debug(msg: string): void {
    this.log('debug', msg);
  }

  info(msg: string): void {
    this.log('info', msg);
  }

  ok(msg: string): void {
    this.log('ok', msg);
  }

  warn(msg: string): void {
    this.log('warn', msg);
  }

  error(msg: string): void {
    this.log('error', msg);
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

      let prefix = level.toUpperCase();
      while (prefix.length < 5) {
        prefix += ' ';
      }

      msg = wordWrap(msg.toString(), prefix.length + 4, this.ttyWidth);

      const color = this.getStatusColor(level);
      const statusColor = color.bold.bgBlack;
      const b = this.chalk.dim;

      this.stream.write(b('[') + statusColor(prefix) + b(']') + '  ' + msg + '\n');
    }
  }
}


const LOG_LEVELS: string[] = ['debug', 'info', 'ok', 'warn', 'error'];


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

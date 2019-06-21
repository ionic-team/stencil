import * as d from '../declarations';


export class TestingLogger implements d.Logger {

  enable = false;

  level: string;
  info(...msg: any[]) {
    if (this.enable) {
      console.log.apply(console, msg);
    }
  }
  warn(...msg: any[]) {
    if (this.enable) {
      console.warn.apply(console, msg);
    }
  }
  error(...msg: any[]) {
    if (this.enable) {
      console.error.apply(console, msg);
    }
  }
  debug(...msg: any[]) {
    if (this.enable) {
      console.log.apply(console, msg);
    }
  }
  color(_msg: string, _color: 'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'gray') {
    /* */
  }
  red(msg: string) { return msg; }
  green(msg: string) { return msg; }
  yellow(msg: string) { return msg; }
  blue(msg: string) { return msg; }
  magenta(msg: string) { return msg; }
  cyan(msg: string) { return msg; }
  gray(msg: string) { return msg; }
  bold(msg: string) { return msg; }
  dim(msg: string) { return msg; }
  createTimeSpan(_startMsg: string, _debug = false): d.LoggerTimeSpan {
    return {
      duration() { return 0; },
      finish() { return 0; }
    };
  }
  printDiagnostics(_diagnostics: d.Diagnostic[]) {
    /* */
  }
  buildLogFilePath: string = null;
  writeLogs(_: boolean) { /**/ }
}

import { Diagnostic, Logger, LoggerTimeSpan } from '../util/interfaces';


export class TestingLogger implements Logger {
  level: string;
  info(..._msg: any[]) {}
  warn(..._msg: any[]) {}
  error(..._msg: any[]) {}
  debug(..._msg: any[]) {}
  color(_msg: string, _color: 'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'gray') {}
  red(msg: string) { return msg; }
  green(msg: string) { return msg; }
  yellow(msg: string) { return msg; }
  blue(msg: string) { return msg; }
  magenta(msg: string) { return msg; }
  cyan(msg: string) { return msg; }
  gray(msg: string) { return msg; }
  bold(msg: string) { return msg; }
  dim(msg: string) { return msg; }
  createTimeSpan(_startMsg: string, _debug = false): LoggerTimeSpan {
    return {
      finish: () => {}
    };
  }
  printDiagnostics(_diagnostics: Diagnostic[]) {}
}

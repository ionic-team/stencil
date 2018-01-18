import * as d from './index';


export interface Logger {
  level: string;
  debug(...msg: any[]): void;
  info(...msg: any[]): void;
  warn(...msg: any[]): void;
  error(...msg: any[]): void;
  createTimeSpan(startMsg: string, debug?: boolean): LoggerTimeSpan;
  printDiagnostics(diagnostics: d.Diagnostic[]): void;
  red(msg: string): string;
  green(msg: string): string;
  yellow(msg: string): string;
  blue(msg: string): string;
  magenta(msg: string): string;
  cyan(msg: string): string;
  gray(msg: string): string;
  bold(msg: string): string;
  dim(msg: string): string;
}


export interface LoggerTimeSpan {
  finish(finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean): void;
}

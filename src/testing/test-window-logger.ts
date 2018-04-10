import * as d from '../declarations';


export class TestWindowLogger implements d.Logger {
  private logs: LogQueue[] = [];
  buildLogFilePath: string = null;
  level: string;

  printLogs() {
    this.logs.forEach(log => {
      console[log.level].apply(console, log.msgs);
    });
    this.logs.length = 0;
  }

  info(...msgs: any[]) {
    this.logs.push({
      level: 'info',
      msgs: msgs
    });
  }

  error(...msgs: any[]) {
    this.logs.push({
      level: 'error',
      msgs: msgs
    });
  }

  warn(...msgs: any[]) {
    this.logs.push({
      level: 'warn',
      msgs: msgs
    });
  }

  debug() {/**/}

  createTimeSpan(_startMsg: string) {
    return {
      finish: () => {/**/}
    };
  }

  printDiagnostics(_diagnostics: d.Diagnostic[]) {/**/}

  green(v: string) {
    return v;
  }

  yellow(v: string) {
    return v;
  }

  red(v: string) {
    return v;
  }

  blue(v: string) {
    return v;
  }

  magenta(v: string) {
    return v;
  }

  cyan(v: string) {
    return v;
  }

  gray(v: string) {
    return v;
  }

  bold(v: string) {
    return v;
  }

  dim(v: string) {
    return v;
  }

  writeLogs(_append: boolean) {/**/}

}


interface LogQueue {
  level: 'info' | 'error' | 'warn';
  msgs: any[];
}

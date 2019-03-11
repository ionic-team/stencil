import * as d from '../../declarations';


export function logBuild(msg: string) {
  log(BLUE, 'Build', msg);
}


export function logReload(msg: string) {
  logWarn('Reload', msg);
}


export function logWarn(prefix: string, msg: string) {
  log(YELLOW, prefix, msg);
}


export function logDisabled(prefix: string, msg: string) {
  log(GRAY, prefix, msg);
}


export function logDiagnostic(diagnostic: d.Diagnostic) {
  let color = RED;
  let prefix = 'Error';

  if (diagnostic.level === 'warn') {
    color = YELLOW;
    prefix = 'Warning';
  }

  if (diagnostic.header) {
    prefix = diagnostic.header;
  }

  let msg = ``;

  if (diagnostic.relFilePath) {
    msg += diagnostic.relFilePath;

    if (typeof diagnostic.lineNumber === 'number' && diagnostic.lineNumber > 0) {
      msg += ', line ' + diagnostic.lineNumber;

      if (typeof diagnostic.columnNumber === 'number' && diagnostic.columnNumber > 0) {
        msg += ', column ' + diagnostic.columnNumber;
      }
    }
    msg += `\n`;
  }

  msg += diagnostic.messageText;

  log(color, prefix, msg);
}


function log(color: string, prefix: string, msg: string) {
  const styledPrefix = [
    '%c' + prefix,
    `background: ${color}; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`
  ];

  console.log(...styledPrefix, msg);
}


const YELLOW = `#f39c12`;
const RED = `#c0392b`;
const BLUE = `#3498db`;
const GRAY = `#717171`;

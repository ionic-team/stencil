import { Diagnostic, PrintLine } from '../../declarations';


export function cleanDiagnostics(diagnostics: Diagnostic[]) {
  const cleaned: Diagnostic[] = [];

  const maxErrors = Math.min(diagnostics.length, MAX_ERRORS);
  const dups: {[key: string]: boolean} = {};

  for (var i = 0; i < maxErrors; i++) {
    const d = diagnostics[i];

    const key = d.absFilePath + d.code + d.messageText + d.type;
    if (dups[key]) {
      continue;
    }
    dups[key] = true;

    if (d.messageText) {
      if (typeof (<any>d.messageText).message === 'string') {
        d.messageText = (<any>d.messageText).message;

      } else if (typeof d.messageText === 'string' && d.messageText.indexOf('Error: ') === 0) {
        d.messageText = d.messageText.substr(7);
      }
    }

    cleaned.push(d);
  }

  return cleaned;
}


export function formatFileName(cwd: string, fileName: string, startLineNumber: number = null, startCharNumber: number = null) {
  if (!fileName) return '';

  if (cwd) {
    fileName = fileName.replace(cwd, '');
    if (/\/|\\/.test(fileName.charAt(0))) {
      fileName = fileName.substr(1);
    }
  }

  if (startLineNumber != null && typeof startLineNumber === 'number' && startLineNumber >= 0) {
    fileName += ':' + startLineNumber;

    if (startCharNumber != null && typeof startCharNumber === 'number' && startCharNumber >= 0) {
      fileName += ':' + startCharNumber;
    }
  }

  return fileName;
}


export function formatHeader(type: string, fileName: string, cwd: string, startLineNumber: number = null, startCharNumber: number = null) {
  return `${type}: ${formatFileName(cwd, fileName, startLineNumber, startCharNumber)}`;
}


export function prepareLines(orgLines: PrintLine[], code: 'text'|'html') {
  const lines: PrintLine[] = JSON.parse(JSON.stringify(orgLines));

  for (let i = 0; i < 100; i++) {
    if (!eachLineHasLeadingWhitespace(lines, code)) {
      return lines;
    }
    for (let i = 0; i < lines.length; i++) {
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
  for (let i = 0; i < lines.length; i++) {
    if ( !(<any>lines[i])[code] || (<any>lines[i])[code].length < 1) {
      return false;
    }
    const firstChar = (<any>lines[i])[code].charAt(0);
    if (firstChar !== ' ' && firstChar !== '\t') {
      return false;
    }
  }
  return true;
}


export function splitLineBreaks(sourceText: string) {
  if (!sourceText) return [];
  sourceText = sourceText.replace(/\\r/g, '\n');
  return sourceText.split('\n');
}


export function escapeHtml(unsafe: any) {
  if (unsafe === undefined) return 'undefined';
  if (unsafe === null) return 'null';

  if (typeof unsafe !== 'string') {
    unsafe = unsafe.toString();
  }

  return unsafe
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;');
}


export const MAX_ERRORS = 15;

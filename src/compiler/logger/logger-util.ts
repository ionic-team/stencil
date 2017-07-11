import { Diagnostic, PrintLine } from '../interfaces';


export function cleanDiagnostics(diagnostics: Diagnostic[]) {
  const cleaned: Diagnostic[] = [];

  diagnostics.forEach(d => {
    if (cleaned.length < MAX_ERRORS && !cleaned.some(c => c.messageText === d.messageText)) {
      cleaned.push(d);
    }
  });

  cleaned.forEach(d => {
    if (typeof d.messageText === 'string' && d.messageText.indexOf('Error: ') === 0) {
      d.messageText = d.messageText.substr(7);
    }
  });

  return cleaned;
}


export function formatFileName(rootDir: string, fileName: string) {
  fileName = fileName.replace(rootDir, '');
  if (/\/|\\/.test(fileName.charAt(0))) {
    fileName = fileName.substr(1);
  }
  if (fileName.length > 80) {
    fileName = '...' + fileName.substr(fileName.length - 80);
  }
  return fileName;
}


export function formatHeader(type: string, fileName: string, rootDir: string, startLineNumber: number = null, endLineNumber: number = null) {
  let header = `${type}: ${formatFileName(rootDir, fileName)}`;

  if (startLineNumber !== null && startLineNumber > 0) {
    if (endLineNumber !== null && endLineNumber > startLineNumber) {
      header += `, lines: ${startLineNumber} - ${endLineNumber}`;
    } else {
      header += `, line: ${startLineNumber}`;
    }
  }

  return header;
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
  for (var i = 0; i < lines.length; i++) {
    if ( !(<any>lines[i])[code] || (<any>lines[i])[code].length < 1) {
      return false;
    }
    var firstChar = (<any>lines[i])[code].charAt(0);
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

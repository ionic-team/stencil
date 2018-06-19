import * as d from '../../declarations';


export function cleanDiagnostics(diagnostics: d.Diagnostic[]) {
  const cleaned: d.Diagnostic[] = [];

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

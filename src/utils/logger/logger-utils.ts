import type * as d from '../../declarations';

export const normalizeDiagnostics = (compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[]) => {
  const normalizedErrors: d.Diagnostic[] = [];
  const normalizedOthers: d.Diagnostic[] = [];
  const dups = new Set<string>();

  for (let i = 0; i < diagnostics.length; i++) {
    const d = normalizeDiagnostic(compilerCtx, diagnostics[i]);

    const key = d.absFilePath + d.code + d.messageText + d.type;
    if (dups.has(key)) {
      continue;
    }
    dups.add(key);

    const total = normalizedErrors.length + normalizedOthers.length;
    if (d.level === 'error') {
      normalizedErrors.push(d);
    } else if (total < MAX_ERRORS) {
      normalizedOthers.push(d);
    }
  }

  return [...normalizedErrors, ...normalizedOthers];
};

const normalizeDiagnostic = (compilerCtx: d.CompilerCtx, diagnostic: d.Diagnostic) => {
  if (diagnostic.messageText) {
    if (typeof (<any>diagnostic.messageText).message === 'string') {
      diagnostic.messageText = (<any>diagnostic.messageText).message;
    } else if (typeof diagnostic.messageText === 'string' && diagnostic.messageText.indexOf('Error: ') === 0) {
      diagnostic.messageText = diagnostic.messageText.substr(7);
    }
  }

  if (diagnostic.messageText) {
    if (diagnostic.messageText.includes(`Cannot find name 'h'`)) {
      diagnostic.header = `Missing "h" import for JSX types`;
      diagnostic.messageText = `In order to load accurate JSX types for components, the "h" function must be imported from "@stencil/core" by each component using JSX. For example: import { Component, h } from '@stencil/core';`;

      try {
        const sourceText = compilerCtx.fs.readFileSync(diagnostic.absFilePath);
        const srcLines = splitLineBreaks(sourceText);
        for (let i = 0; i < srcLines.length; i++) {
          const srcLine = srcLines[i];
          if (srcLine.includes('@stencil/core')) {
            const msgLines: d.PrintLine[] = [];

            const beforeLineIndex = i - 1;
            if (beforeLineIndex > -1) {
              const beforeLine: d.PrintLine = {
                lineIndex: beforeLineIndex,
                lineNumber: beforeLineIndex + 1,
                text: srcLines[beforeLineIndex],
                errorCharStart: -1,
                errorLength: -1,
              };
              msgLines.push(beforeLine);
            }

            const errorLine: d.PrintLine = {
              lineIndex: i,
              lineNumber: i + 1,
              text: srcLine,
              errorCharStart: 0,
              errorLength: -1,
            };
            msgLines.push(errorLine);
            diagnostic.lineNumber = errorLine.lineNumber;
            diagnostic.columnNumber = srcLine.indexOf('}');

            const afterLineIndex = i + 1;
            if (afterLineIndex < srcLines.length) {
              const afterLine: d.PrintLine = {
                lineIndex: afterLineIndex,
                lineNumber: afterLineIndex + 1,
                text: srcLines[afterLineIndex],
                errorCharStart: -1,
                errorLength: -1,
              };
              msgLines.push(afterLine);
            }

            diagnostic.lines = msgLines;
            break;
          }
        }
      } catch (e) {}
    }
  }

  return diagnostic;
};

export const splitLineBreaks = (sourceText: string) => {
  if (typeof sourceText !== 'string') return [];
  sourceText = sourceText.replace(/\\r/g, '\n');
  return sourceText.split('\n');
};

export const escapeHtml = (unsafe: any) => {
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
};

export const MAX_ERRORS = 25;

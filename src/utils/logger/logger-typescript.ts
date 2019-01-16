import * as d from '../../declarations';
import { MAX_ERRORS, splitLineBreaks } from './logger-utils';
import { normalizePath } from '../path-utils';
import ts from 'typescript';


/**
 * Ok, so formatting overkill, we know. But whatever, it makes for great
 * error reporting within a terminal. So, yeah, let's code it up, shall we?
 */

export function loadTypeScriptDiagnostics(config: d.Config, resultsDiagnostics: d.Diagnostic[], tsDiagnostics: ts.Diagnostic[]) {
  const maxErrors = Math.min(tsDiagnostics.length, MAX_ERRORS);

  for (let i = 0; i < maxErrors; i++) {
    resultsDiagnostics.push(loadTypeScriptDiagnostic(config, tsDiagnostics[i]));
  }
}


export function loadTypeScriptDiagnostic(config: d.Config, tsDiagnostic: ts.Diagnostic) {

  const d: d.Diagnostic = {
    level: 'warn',
    type: 'typescript',
    language: 'typescript',
    header: 'TypeScript',
    code: tsDiagnostic.code.toString(),
    messageText: formatMessageText(tsDiagnostic),
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (tsDiagnostic.category === 1) {
    d.level = 'error';
  }

  if (tsDiagnostic.file) {
    d.absFilePath = normalizePath(tsDiagnostic.file.fileName);
    if (config) {
      d.relFilePath = normalizePath(config.sys.path.relative(config.cwd, d.absFilePath));

      if (!d.relFilePath.includes('/')) {
        d.relFilePath = './' + d.relFilePath;
      }
    }

    const sourceText = tsDiagnostic.file.text;
    const srcLines = splitLineBreaks(sourceText);

    const posData = tsDiagnostic.file.getLineAndCharacterOfPosition(tsDiagnostic.start);

    const errorLine: d.PrintLine = {
      lineIndex: posData.line,
      lineNumber: posData.line + 1,
      text: srcLines[posData.line],
      errorCharStart: posData.character,
      errorLength: Math.max(tsDiagnostic.length, 1)
    };

    d.lineNumber = errorLine.lineNumber;
    d.columnNumber = errorLine.errorCharStart;

    d.lines.push(errorLine);

    if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
      errorLine.errorLength = 1;
      errorLine.errorCharStart--;
    }

    if (errorLine.lineIndex > 0) {
      const previousLine: d.PrintLine = {
        lineIndex: errorLine.lineIndex - 1,
        lineNumber: errorLine.lineNumber - 1,
        text: srcLines[errorLine.lineIndex - 1],
        errorCharStart: -1,
        errorLength: -1
      };

      d.lines.unshift(previousLine);
    }

    if (errorLine.lineIndex + 1 < srcLines.length) {
      const nextLine: d.PrintLine = {
        lineIndex: errorLine.lineIndex + 1,
        lineNumber: errorLine.lineNumber + 1,
        text: srcLines[errorLine.lineIndex + 1],
        errorCharStart: -1,
        errorLength: -1
      };

      d.lines.push(nextLine);
    }
  }

  return d;
}


function formatMessageText(tsDiagnostic: ts.Diagnostic) {
  let diagnosticChain = tsDiagnostic.messageText;

  if (typeof diagnosticChain === 'string') {
    return diagnosticChain;
  }

  const ignoreCodes: number[] = [];
  const isStencilConfig = tsDiagnostic.file.fileName.includes('stencil.config');
  if (isStencilConfig) {
    ignoreCodes.push(2322);
  }

  let result = '';

  while (diagnosticChain) {
    if (!ignoreCodes.includes(diagnosticChain.code)) {
      result += diagnosticChain.messageText + ' ';
    }

    diagnosticChain = diagnosticChain.next;
  }

  if (isStencilConfig) {
    result = result.replace(`type 'StencilConfig'`, `Stencil Config`);
    result = result.replace(`Object literal may only specify known properties, but `, ``);
    result = result.replace(`Object literal may only specify known properties, and `, ``);
  }

  return result.trim();
}

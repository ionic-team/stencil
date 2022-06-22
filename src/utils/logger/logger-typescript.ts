import type * as d from '../../declarations';
import { isIterable } from '../helpers';
import { normalizePath } from '../normalize-path';
import { splitLineBreaks } from './logger-utils';
import type { Diagnostic, DiagnosticMessageChain, Node } from 'typescript';

/**
 * Augment a `Diagnostic` with information from a `Node` in the AST to provide richer error information
 * @param d the diagnostic to augment
 * @param node the node to augment with additional information
 * @returns the augmented diagnostic
 */
export const augmentDiagnosticWithNode = (d: d.Diagnostic, node: Node): d.Diagnostic => {
  if (!node) {
    return d;
  }

  const sourceFile = node.getSourceFile();
  if (!sourceFile) {
    return d;
  }

  d.absFilePath = normalizePath(sourceFile.fileName);

  const sourceText = sourceFile.text;
  const srcLines = splitLineBreaks(sourceText);

  const start = node.getStart();
  const end = node.getEnd();
  const posStart = sourceFile.getLineAndCharacterOfPosition(start);

  const errorLine: d.PrintLine = {
    lineIndex: posStart.line,
    lineNumber: posStart.line + 1,
    text: srcLines[posStart.line],
    errorCharStart: posStart.character,
    errorLength: Math.max(end - start, 1),
  };
  // store metadata for line number and character index where the error occurred
  d.lineNumber = errorLine.lineNumber;
  d.columnNumber = errorLine.errorCharStart + 1;
  d.lines.push(errorLine);
  if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
    errorLine.errorLength = 1;
    errorLine.errorCharStart--;
  }

  // if the error did not occur on the first line of the file, add metadata for the line of code preceding the line
  // where the error was detected to provide the user with additional context
  if (errorLine.lineIndex > 0) {
    const previousLine: d.PrintLine = {
      lineIndex: errorLine.lineIndex - 1,
      lineNumber: errorLine.lineNumber - 1,
      text: srcLines[errorLine.lineIndex - 1],
      errorCharStart: -1,
      errorLength: -1,
    };

    d.lines.unshift(previousLine);
  }

  // if the error did not occur on the last line of the file, add metadata for the line of code following the line
  // where the error was detected to provide the user with additional context
  if (errorLine.lineIndex + 1 < srcLines.length) {
    const nextLine: d.PrintLine = {
      lineIndex: errorLine.lineIndex + 1,
      lineNumber: errorLine.lineNumber + 1,
      text: srcLines[errorLine.lineIndex + 1],
      errorCharStart: -1,
      errorLength: -1,
    };

    d.lines.push(nextLine);
  }

  return d;
};

/**
 * Ok, so formatting overkill, we know. But whatever, it makes for great
 * error reporting within a terminal. So, yeah, let's code it up, shall we?
 */

export const loadTypeScriptDiagnostics = (tsDiagnostics: readonly Diagnostic[]) => {
  const diagnostics: d.Diagnostic[] = [];
  const maxErrors = Math.min(tsDiagnostics.length, 50);

  for (let i = 0; i < maxErrors; i++) {
    diagnostics.push(loadTypeScriptDiagnostic(tsDiagnostics[i]));
  }

  return diagnostics;
};

export const loadTypeScriptDiagnostic = (tsDiagnostic: Diagnostic) => {
  const d: d.Diagnostic = {
    level: 'warn',
    type: 'typescript',
    language: 'typescript',
    header: 'TypeScript',
    code: tsDiagnostic.code.toString(),
    messageText: flattenDiagnosticMessageText(tsDiagnostic, tsDiagnostic.messageText),
    relFilePath: null,
    absFilePath: null,
    lines: [],
  };

  if (tsDiagnostic.category === 1) {
    d.level = 'error';
  }

  if (tsDiagnostic.file) {
    d.absFilePath = tsDiagnostic.file.fileName;

    const sourceText = tsDiagnostic.file.text;
    const srcLines = splitLineBreaks(sourceText);

    const posData = tsDiagnostic.file.getLineAndCharacterOfPosition(tsDiagnostic.start);

    const errorLine: d.PrintLine = {
      lineIndex: posData.line,
      lineNumber: posData.line + 1,
      text: srcLines[posData.line],
      errorCharStart: posData.character,
      errorLength: Math.max(tsDiagnostic.length, 1),
    };

    d.lineNumber = errorLine.lineNumber;
    d.columnNumber = errorLine.errorCharStart + 1;

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
        errorLength: -1,
      };

      d.lines.unshift(previousLine);
    }

    if (errorLine.lineIndex + 1 < srcLines.length) {
      const nextLine: d.PrintLine = {
        lineIndex: errorLine.lineIndex + 1,
        lineNumber: errorLine.lineNumber + 1,
        text: srcLines[errorLine.lineIndex + 1],
        errorCharStart: -1,
        errorLength: -1,
      };

      d.lines.push(nextLine);
    }
  }

  return d;
};

const flattenDiagnosticMessageText = (tsDiagnostic: Diagnostic, diag: string | DiagnosticMessageChain | undefined) => {
  if (typeof diag === 'string') {
    return diag;
  } else if (diag === undefined) {
    return '';
  }

  const ignoreCodes: number[] = [];
  const isStencilConfig = tsDiagnostic.file.fileName.includes('stencil.config');
  if (isStencilConfig) {
    ignoreCodes.push(2322);
  }

  let result = '';
  if (!ignoreCodes.includes(diag.code)) {
    result = diag.messageText;
    if (isIterable(diag.next)) {
      for (const kid of diag.next) {
        result += flattenDiagnosticMessageText(tsDiagnostic, kid);
      }
    }
  }

  if (isStencilConfig) {
    result = result.replace(`type 'StencilConfig'`, `Stencil Config`);
    result = result.replace(`Object literal may only specify known properties, but `, ``);
    result = result.replace(`Object literal may only specify known properties, and `, ``);
  }

  return result.trim();
};

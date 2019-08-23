import * as d from '../../declarations';
import { splitLineBreaks } from './logger-utils';
import ts from 'typescript';
import { normalizePath } from '../normalize-path';


export const augmentDiagnosticWithNode = (config: d.Config, d: d.Diagnostic, node: ts.Node) => {
  if (!node) {
    return d;
  }

  const sourceFile = node.getSourceFile();
  if (!sourceFile) {
    return d;
  }

  d.absFilePath = normalizePath(sourceFile.fileName);
  d.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, sourceFile.fileName));

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
    errorLength: Math.max(end - start, 1)
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

  return d;
};


/**
 * Ok, so formatting overkill, we know. But whatever, it makes for great
 * error reporting within a terminal. So, yeah, let's code it up, shall we?
 */
export const loadTypeScriptDiagnostics = (tsDiagnostics: readonly ts.Diagnostic[]) => {
  const diagnostics: d.Diagnostic[] = [];
  const maxErrors = Math.min(tsDiagnostics.length, 50);

  for (let i = 0; i < maxErrors; i++) {
    diagnostics.push(loadTypeScriptDiagnostic(tsDiagnostics[i]));
  }

  return diagnostics;
};


export const loadTypeScriptDiagnostic = (tsDiagnostic: ts.Diagnostic) => {
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
  } else if (tsDiagnostic.category === 2) {
    d.level = 'info';
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
      errorLength: Math.max(tsDiagnostic.length, 1)
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
};


const formatMessageText = (tsDiagnostic: ts.Diagnostic) => {
  let msg = flattenDiagnosticMessageText(tsDiagnostic.messageText);

  if (tsDiagnostic.file) {
    const ignoreCodes: number[] = [];
    const isStencilConfig = tsDiagnostic.file.fileName.includes('stencil.config');
    if (isStencilConfig) {
      ignoreCodes.push(2322);
    }

    if (isStencilConfig) {
      msg = msg.replace(`type 'StencilConfig'`, `Stencil Config`);
      msg = msg.replace(`Object literal may only specify known properties, but `, ``);
      msg = msg.replace(`Object literal may only specify known properties, and `, ``);
    }
  }

  return msg.trim();
};

const flattenDiagnosticMessageText = (diag: any) => {
  if (typeof diag === 'string') {
    return diag;
  } else if (diag == null) {
    return '';
  }

  let msg = diag.messageText;
  if (diag.next) {
    for (let i = 0, a = diag.next; i < a.length; i++) {
      msg += flattenDiagnosticMessageText(a[i]);
    }
  }
  return msg;
};

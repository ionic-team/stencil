import * as d from '@declarations';


export function buildError(diagnostics: d.Diagnostic[]) {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'Build Error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  diagnostics.push(diagnostic);

  return diagnostic;
}


export function buildWarn(diagnostics: d.Diagnostic[]) {
  const diagnostic: d.Diagnostic = {
    level: 'warn',
    type: 'build',
    header: 'build warn',
    messageText: 'build warn',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  diagnostics.push(diagnostic);

  return diagnostic;
}


export function catchError(diagnostics: d.Diagnostic[], err: Error, msg?: string) {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'Build Error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (typeof msg === 'string') {
    diagnostic.messageText = msg;

  } else if (err != null) {
    if (err.stack != null) {
      diagnostic.messageText = err.stack.toString();

    } else {
      if (err.message != null) {
        diagnostic.messageText = err.message.toString();

      } else {
        diagnostic.messageText = err.toString();
      }
    }
  }

  if (diagnostics != null && !shouldIgnoreError(diagnostic.messageText)) {
    diagnostics.push(diagnostic);
  }
}

export function hasError(diagnostics: d.Diagnostic[]): boolean {
  if (diagnostics == null || diagnostics.length === 0) {
    return false;
  }
  return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
}


export function hasWarning(diagnostics: d.Diagnostic[]): boolean {
  if (diagnostics == null || diagnostics.length === 0) {
    return false;
  }
  return diagnostics.some(d => d.level === 'warn');
}


export function shouldIgnoreError(msg: any) {
  return (msg === TASK_CANCELED_MSG);
}

export const TASK_CANCELED_MSG = `task canceled`;

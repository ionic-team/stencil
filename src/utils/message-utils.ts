import * as d from '../declarations';


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


export function buildJsonFileWarn(compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], jsonFilePath: string, msg: string, warnKey: string) {
  const warn = buildWarn(diagnostics);
  warn.messageText = msg;
  warn.absFilePath = jsonFilePath;

  if (typeof warnKey === 'string') {
    try {
      const jsonStr = compilerCtx.fs.readFileSync(jsonFilePath);
      const lines = jsonStr.replace(/\r/g, '\n').split('\n');

      for (let i = 0; i < lines.length; i++) {
        const txtLine = lines[i];
        const txtIndex = txtLine.indexOf(warnKey);

        if (txtIndex > -1) {
          const warnLine: d.PrintLine = {
            lineIndex: i,
            lineNumber: i + 1,
            text: txtLine,
            errorCharStart: txtIndex,
            errorLength: warnKey.length
          };
          warn.lineNumber = warnLine.lineNumber;
          warn.columnNumber = txtIndex + 1;
          warn.lines.push(warnLine);

          if (i >= 0) {
            const beforeWarnLine: d.PrintLine = {
              lineIndex: warnLine.lineIndex - 1,
              lineNumber: warnLine.lineNumber - 1,
              text: lines[i - 1],
              errorCharStart: -1,
              errorLength: -1
            };
            warn.lines.unshift(beforeWarnLine);
          }

          if (i < lines.length) {
            const afterWarnLine: d.PrintLine = {
              lineIndex: warnLine.lineIndex + 1,
              lineNumber: warnLine.lineNumber + 1,
              text: lines[i + 1],
              errorCharStart: -1,
              errorLength: -1
            };
            warn.lines.push(afterWarnLine);
          }

          break;
        }
      }
    } catch (e) {}
  }

  return warn;
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

  return diagnostic;
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

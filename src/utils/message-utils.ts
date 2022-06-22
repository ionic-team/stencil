import type * as d from '../declarations';
import { isString } from './helpers';

/**
 * Builds a template `Diagnostic` entity for a build error. The created `Diagnostic` is returned, and have little
 * detail attached to it regarding the specifics of the error - it is the responsibility of the caller of this method
 * to attach the specifics of the error message.
 *
 * The created `Diagnostic` is pushed to the `diagnostics` argument as a side effect of calling this method.
 *
 * @param diagnostics the existing diagnostics that the created template `Diagnostic` should be added to
 * @returns the created `Diagnostic`
 */
export const buildError = (diagnostics?: d.Diagnostic[]): d.Diagnostic => {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'Build Error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: [],
  };

  if (diagnostics) {
    diagnostics.push(diagnostic);
  }

  return diagnostic;
};

/**
 * Builds a template `Diagnostic` entity for a build warning. The created `Diagnostic` is returned, and have little
 * detail attached to it regarding the specifics of the warning - it is the responsibility of the caller of this method
 * to attach the specifics of the warning message.
 *
 * The created `Diagnostic` is pushed to the `diagnostics` argument as a side effect of calling this method.
 *
 * @param diagnostics the existing diagnostics that the created template `Diagnostic` should be added to
 * @returns the created `Diagnostic`
 */
export const buildWarn = (diagnostics: d.Diagnostic[]): d.Diagnostic => {
  const diagnostic: d.Diagnostic = {
    level: 'warn',
    type: 'build',
    header: 'Build Warn',
    messageText: 'build warn',
    relFilePath: null,
    absFilePath: null,
    lines: [],
  };

  diagnostics.push(diagnostic);

  return diagnostic;
};

export const buildJsonFileError = (
  compilerCtx: d.CompilerCtx,
  diagnostics: d.Diagnostic[],
  jsonFilePath: string,
  msg: string,
  pkgKey: string
) => {
  const err = buildError(diagnostics);
  err.messageText = msg;
  err.absFilePath = jsonFilePath;

  if (typeof pkgKey === 'string') {
    try {
      const jsonStr = compilerCtx.fs.readFileSync(jsonFilePath);
      const lines = jsonStr.replace(/\r/g, '\n').split('\n');

      for (let i = 0; i < lines.length; i++) {
        const txtLine = lines[i];
        const txtIndex = txtLine.indexOf(pkgKey);

        if (txtIndex > -1) {
          const warnLine: d.PrintLine = {
            lineIndex: i,
            lineNumber: i + 1,
            text: txtLine,
            errorCharStart: txtIndex,
            errorLength: pkgKey.length,
          };
          err.lineNumber = warnLine.lineNumber;
          err.columnNumber = txtIndex + 1;
          err.lines.push(warnLine);

          if (i >= 0) {
            const beforeWarnLine: d.PrintLine = {
              lineIndex: warnLine.lineIndex - 1,
              lineNumber: warnLine.lineNumber - 1,
              text: lines[i - 1],
              errorCharStart: -1,
              errorLength: -1,
            };
            err.lines.unshift(beforeWarnLine);
          }

          if (i < lines.length) {
            const afterWarnLine: d.PrintLine = {
              lineIndex: warnLine.lineIndex + 1,
              lineNumber: warnLine.lineNumber + 1,
              text: lines[i + 1],
              errorCharStart: -1,
              errorLength: -1,
            };
            err.lines.push(afterWarnLine);
          }

          break;
        }
      }
    } catch (e) {}
  }

  return err;
};

/**
 * Builds a diagnostic from an `Error`, appends it to the `diagnostics` parameter, and returns the created diagnostic
 * @param diagnostics the series of diagnostics the newly created diagnostics should be added to
 * @param err the error to derive information from in generating the diagnostic
 * @param msg an optional message to use in place of `err` to generate the diagnostic
 * @returns the generated diagnostic
 */
export const catchError = (diagnostics: d.Diagnostic[], err: Error | null | undefined, msg?: string): d.Diagnostic => {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'Build Error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: [],
  };

  if (isString(msg)) {
    diagnostic.messageText = msg.length ? msg : 'UNKNOWN ERROR';
  } else if (err != null) {
    if (err.stack != null) {
      diagnostic.messageText = err.stack.toString();
    } else {
      if (err.message != null) {
        diagnostic.messageText = err.message.length ? err.message : 'UNKNOWN ERROR';
      } else {
        diagnostic.messageText = err.toString();
      }
    }
  }

  if (diagnostics != null && !shouldIgnoreError(diagnostic.messageText)) {
    diagnostics.push(diagnostic);
  }

  return diagnostic;
};

/**
 * Determine if the provided diagnostics have any build errors
 * @param diagnostics the diagnostics to inspect
 * @returns true if any of the diagnostics in the list provided are errors that did not occur at runtime. false
 * otherwise.
 */
export const hasError = (diagnostics: d.Diagnostic[]): boolean => {
  if (diagnostics == null || diagnostics.length === 0) {
    return false;
  }
  return diagnostics.some((d) => d.level === 'error' && d.type !== 'runtime');
};

/**
 * Determine if the provided diagnostics have any warnings
 * @param diagnostics the diagnostics to inspect
 * @returns true if any of the diagnostics in the list provided are warnings. false otherwise.
 */
export const hasWarning = (diagnostics: d.Diagnostic[]): boolean => {
  if (diagnostics == null || diagnostics.length === 0) {
    return false;
  }
  return diagnostics.some((d) => d.level === 'warn');
};

export const shouldIgnoreError = (msg: any) => {
  return msg === TASK_CANCELED_MSG;
};

export const TASK_CANCELED_MSG = `task canceled`;

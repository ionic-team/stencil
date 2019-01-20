import * as d from '@declarations';
import { buildWarn } from '../message-utils';
import { normalizePath } from '../path-utils';
import { splitLineBreaks } from './logger-utils';
import { logger, sys } from '@sys';
import { toTitleCase } from '../helpers';


export function loadRollupDiagnostics(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, rollupError: any) {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'bundling',
    language: 'javascript',
    code: rollupError.code,
    header: `Rollup: ${formatErrorCode(rollupError.code)}`,
    messageText: rollupError.message,
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (rollupError.loc && rollupError.loc.file) {
    diagnostic.absFilePath = normalizePath(rollupError.loc.file);
    if (config) {
      diagnostic.relFilePath = normalizePath(sys.path.relative(config.cwd, diagnostic.absFilePath));
    }

    try {
      const sourceText = compilerCtx.fs.readFileSync(diagnostic.absFilePath);
      const srcLines = splitLineBreaks(sourceText);

      const errorLine: d.PrintLine = {
        lineIndex: rollupError.loc.line - 1,
        lineNumber: rollupError.loc.line,
        text: srcLines[rollupError.loc.line - 1],
        errorCharStart: rollupError.loc.column,
        errorLength: 0
      };

      diagnostic.lineNumber = errorLine.lineNumber;
      diagnostic.columnNumber = errorLine.errorCharStart;

      const highlightLine = errorLine.text.substr(rollupError.loc.column);
      for (var i = 0; i < highlightLine.length; i++) {
        if (charBreak.has(highlightLine.charAt(i))) {
          break;
        }
        errorLine.errorLength++;
      }

      diagnostic.lines.push(errorLine);

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

        diagnostic.lines.unshift(previousLine);
      }

      if (errorLine.lineIndex + 1 < srcLines.length) {
        const nextLine: d.PrintLine = {
          lineIndex: errorLine.lineIndex + 1,
          lineNumber: errorLine.lineNumber + 1,
          text: srcLines[errorLine.lineIndex + 1],
          errorCharStart: -1,
          errorLength: -1
        };

        diagnostic.lines.push(nextLine);
      }
    } catch (e) {
      diagnostic.messageText = `Error parsing: ${rollupError.loc.file}, line: ${rollupError.loc.line}, column: ${rollupError.loc.column}`;
    }
  }

  buildCtx.diagnostics.push(diagnostic);
}

const charBreak = new Set([' ', '=', '.', ',', '?', ':', ';', '(', ')', '{', '}', '[', ']', '|', `'`, `"`, '`']);


export function createOnWarnFn(diagnostics: d.Diagnostic[], bundleModulesFiles?: d.Module[]) {
  const previousWarns = new Set<string>();

  return function onWarningMessage(warning: { code: string, importer: string, message: string }) {
    if (!warning || previousWarns.has(warning.message)) {
      return;
    }

    previousWarns.add(warning.message);

    if (warning.code) {
      if (ignoreWarnCodes.has(warning.code)) {
        return;
      }
      if (suppressWarnCodes.has(warning.code)) {
        logger.debug(warning.message);
        return;
      }
    }

    let label = '';
    if (bundleModulesFiles) {
      label = bundleModulesFiles.reduce((cmps, m) => {
        cmps.push(...m.cmps);
        return cmps;
      }, [] as d.ComponentCompilerMeta[]).join(', ').trim();

      if (label.length) {
        label += ': ';
      }
    }

    const diagnostic = buildWarn(diagnostics);
    diagnostic.header = `Bundling Warning`;
    diagnostic.messageText = label + (warning.message || warning);
  };
}

const ignoreWarnCodes = new Set([
  `THIS_IS_UNDEFINED`, `NON_EXISTENT_EXPORT`
]);

const suppressWarnCodes = new Set([
  `CIRCULAR_DEPENDENCY`
]);


function formatErrorCode(errorCode: any) {
  if (typeof errorCode === 'string') {
    return errorCode.split('_').map(c => {
      return toTitleCase(c.toLowerCase());
    }).join(' ');
  }

  return errorCode;
}

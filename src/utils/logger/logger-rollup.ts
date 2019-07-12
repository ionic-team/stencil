import * as d from '../../declarations';
import { buildWarn } from '../message-utils';
import { splitLineBreaks } from './logger-utils';
import { toTitleCase } from '../helpers';


export const loadRollupDiagnostics = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, rollupError: any) => {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'bundling',
    language: 'javascript',
    code: rollupError.code,
    header: `Rollup: ${formatErrorCode(rollupError.code)}`,
    messageText: rollupError.message || '',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (rollupError.plugin) {
    diagnostic.messageText += ` (plugin: ${rollupError.plugin}${rollupError.hook ? `, ${rollupError.hook}` : ''})`;
  }

  if (rollupError.loc != null && typeof rollupError.loc.file === 'string') {
    diagnostic.absFilePath = rollupError.loc.file;

    try {
      const sourceText = compilerCtx.fs.readFileSync(diagnostic.absFilePath);

      try {
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
        for (let i = 0; i < highlightLine.length; i++) {
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
        diagnostic.messageText = `Error parsing: ${diagnostic.absFilePath}, line: ${rollupError.loc.line}, column: ${rollupError.loc.column}`;
        diagnostic.debugText = sourceText;
      }

    } catch (e) {}
  }

  buildCtx.diagnostics.push(diagnostic);
};


export const createOnWarnFn = (diagnostics: d.Diagnostic[], bundleModulesFiles?: d.Module[]) => {
  const previousWarns = new Set<string>();

  return function onWarningMessage(warning: { code: string, importer: string, message: string }) {
    if (warning == null || ignoreWarnCodes.has(warning.code) || previousWarns.has(warning.message)) {
      return;
    }

    previousWarns.add(warning.message);

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
    diagnostic.header = `Bundling Warning ${warning.code}`;
    diagnostic.messageText = label + (warning.message || warning);
  };
};

const ignoreWarnCodes = new Set([
  'THIS_IS_UNDEFINED',
  'NON_EXISTENT_EXPORT',
  'CIRCULAR_DEPENDENCY',
  'EMPTY_BUNDLE',
  'UNUSED_EXTERNAL_IMPORT'
]);


const charBreak = new Set([' ', '=', '.', ',', '?', ':', ';', '(', ')', '{', '}', '[', ']', '|', `'`, `"`, '`']);


const formatErrorCode = (errorCode: any) => {
  if (typeof errorCode === 'string') {
    return errorCode.split('_').map(c => {
      return toTitleCase(c.toLowerCase());
    }).join(' ');
  }
  return errorCode || '';
};

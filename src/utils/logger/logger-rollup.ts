import * as d from '../../declarations';
import { buildWarn } from '../message-utils';
import { toTitleCase } from '../helpers';


export function loadRollupDiagnostics(_compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, rollupError: any) {
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

  if (rollupError.loc) {
    diagnostic.absFilePath = rollupError.loc.file;
    diagnostic.lineNumber = rollupError.loc.line;
    diagnostic.columnNumber = rollupError.loc.column;
  }
  if (typeof rollupError.frame === 'string') {
    diagnostic.lines = (rollupError.frame as string).split('\n')
      .map(line => {
        const errorLine: d.PrintLine = {
          lineIndex: 0,
          lineNumber: 0,
          text: line,
          errorCharStart: -1,
          errorLength: -1
        };
        return errorLine;
      });
  }

  buildCtx.diagnostics.push(diagnostic);
}


export function createOnWarnFn(diagnostics: d.Diagnostic[], bundleModulesFiles?: d.Module[]) {
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
}

const ignoreWarnCodes = new Set([
  'THIS_IS_UNDEFINED',
  'NON_EXISTENT_EXPORT',
  'CIRCULAR_DEPENDENCY',
  'EMPTY_BUNDLE',
  'UNUSED_EXTERNAL_IMPORT'
]);


function formatErrorCode(errorCode: any) {
  if (typeof errorCode === 'string') {
    return errorCode.split('_').map(c => {
      return toTitleCase(c.toLowerCase());
    }).join(' ');
  }
  return errorCode || '';
}

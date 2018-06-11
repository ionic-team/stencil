import { BuildCtx, CompilerCtx, Config, Diagnostic, ModuleFile, PrintLine } from '../../declarations';
import { buildWarn } from '../../compiler/util';
import { formatFileName, formatHeader, splitLineBreaks } from './logger-util';
import { highlight } from './highlight/highlight';
import { toTitleCase } from '../helpers';


export function loadRollupDiagnostics(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, rollupError: any) {
  const d: Diagnostic = {
    level: 'error',
    type: 'build',
    language: 'javascript',
    header: 'build error',
    code: rollupError.code,
    messageText: rollupError.message,
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (rollupError.loc && rollupError.loc.file) {
    d.absFilePath = rollupError.loc.file;
    d.relFilePath = formatFileName(config.rootDir, d.absFilePath);

    try {
      const sourceText = compilerCtx.fs.readFileSync(d.absFilePath);
      const srcLines = splitLineBreaks(sourceText);
      let htmlLines = srcLines;

      try {
        htmlLines = splitLineBreaks(highlight(d.language, sourceText, true).value);
      } catch (e) {}

      const errorLine: PrintLine = {
        lineIndex: rollupError.loc.line - 1,
        lineNumber: rollupError.loc.line,
        text: srcLines[rollupError.loc.line - 1],
        html: htmlLines[rollupError.loc.line - 1],
        errorCharStart: rollupError.loc.column,
        errorLength: 0
      };

      const highlightLine = errorLine.text.substr(rollupError.loc.column);
      for (var i = 0; i < highlightLine.length; i++) {
        if (CHAR_BREAK.indexOf(highlightLine.charAt(i)) > -1) {
          break;
        }
        errorLine.errorLength++;
      }

      if (errorLine.html && errorLine.html.indexOf('class="hljs') === -1) {
        try {
          errorLine.html = highlight(d.language, errorLine.text, true).value;
        } catch (e) {}
      }

      d.lines.push(errorLine);

      if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
        errorLine.errorLength = 1;
        errorLine.errorCharStart--;
      }

      const type = formatErrorCode(rollupError.code);

      d.header = formatHeader(type, d.absFilePath, config.cwd, errorLine.lineNumber, errorLine.errorCharStart);

      if (errorLine.lineIndex > 0) {
        const previousLine: PrintLine = {
          lineIndex: errorLine.lineIndex - 1,
          lineNumber: errorLine.lineNumber - 1,
          text: srcLines[errorLine.lineIndex - 1],
          html: htmlLines[errorLine.lineIndex - 1],
          errorCharStart: -1,
          errorLength: -1
        };

        if (previousLine.html && previousLine.html.indexOf('class="hljs') === -1) {
          try {
            previousLine.html = highlight(d.language, previousLine.text, true).value;
          } catch (e) {}
        }

        d.lines.unshift(previousLine);
      }

      if (errorLine.lineIndex + 1 < srcLines.length) {
        const nextLine: PrintLine = {
          lineIndex: errorLine.lineIndex + 1,
          lineNumber: errorLine.lineNumber + 1,
          text: srcLines[errorLine.lineIndex + 1],
          html: htmlLines[errorLine.lineIndex + 1],
          errorCharStart: -1,
          errorLength: -1
        };

        if (nextLine.html && nextLine.html.indexOf('class="hljs') === -1) {
          try {
            nextLine.html = highlight(d.language, nextLine.text, true).value;
          } catch (e) {}
        }

        d.lines.push(nextLine);
      }
    } catch (e) {
      d.messageText = `Error parsing: ${rollupError.loc.file}, line: ${rollupError.loc.line}, column: ${rollupError.loc.column}`;
    }
  }

  buildCtx.diagnostics.push(d);
}

const CHAR_BREAK = [' ', '=', '.', ',', '?', ':', ';', '(', ')', '{', '}', '[', ']', '|', `'`, `"`, '`'];


export function createOnWarnFn(config: Config, diagnostics: Diagnostic[], bundleModulesFiles?: ModuleFile[]) {
  const previousWarns: {[key: string]: boolean} = {};

  return function onWarningMessage(warning: { code: string, importer: string, message: string }) {
    if (!warning || warning.message in previousWarns) {
      return;
    }

    previousWarns[warning.message] = true;

    if (warning.code) {
      if (INGORE_WARNING_CODES.includes(warning.code)) {
        return;
      }
      if (SUPPRESS_WARNING_CODES.includes(warning.code)) {
        config.logger.debug(warning.message);
        return;
      }
    }

    let label = '';
    if (bundleModulesFiles) {
      label = bundleModulesFiles.map(moduleFile => moduleFile.cmpMeta.tagNameMeta).join(', ').trim();
      if (label.length) {
        label += ': ';
      }
    }

    buildWarn(diagnostics).messageText = label + (warning.message || warning);
  };
}


const INGORE_WARNING_CODES = [
  `THIS_IS_UNDEFINED`, `NON_EXISTENT_EXPORT`
];

const SUPPRESS_WARNING_CODES = [
  `CIRCULAR_DEPENDENCY`
];


function formatErrorCode(errorCode: string) {
  if (typeof errorCode === 'string') {
    return errorCode.split('_').map(c => {
      return toTitleCase(c.toLowerCase());
    }).join(' ');
  }

  return errorCode;
}
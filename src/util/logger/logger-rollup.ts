import { BuildConfig, Diagnostic, ModuleFile, PrintLine } from '../interfaces';
import { buildWarn } from '../../compiler/util';
import { formatFileName, formatHeader, splitLineBreaks } from './logger-util';
import { highlight } from './highlight/highlight';


export function loadRollupDiagnostics(config: BuildConfig, resultsDiagnostics: Diagnostic[], rollupError: any) {
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
      let sourceText = config.sys.fs.readFileSync(d.absFilePath, 'utf-8');
      let srcLines = splitLineBreaks(sourceText);
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

      let highlightLine = errorLine.text.substr(rollupError.loc.column);
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

      d.header =  formatHeader('bundling', d.absFilePath, config.rootDir, errorLine.lineNumber);

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

  resultsDiagnostics.push(d);
}

const CHAR_BREAK = [' ', '=', '.', ',', '?', ':', ';', '(', ')', '{', '}', '[', ']', '|', `'`, `"`, '`'];


export function createOnWarnFn(diagnostics: Diagnostic[], bundleModulesFiles?: ModuleFile[]) {
  const previousWarns: {[key: string]: boolean} = {};

  return function onWarningMessage(warning: any) {
    if (warning && warning.message in previousWarns) {
      return;
    }
    if (warning && warning.code) {
      if (INGORE_BUNDLE_CODES.indexOf(warning.code) > -1) {
        return;
      }
    }
    previousWarns[warning.message] = true;

    let label = '';
    if (bundleModulesFiles) {
      label = bundleModulesFiles.map(moduleFile => moduleFile.cmpMeta.tagNameMeta).join(', ').trim();
      if (label.length) {
        label += ': ';
      }
    }

    buildWarn(diagnostics).messageText = label + warning.toString();
  };
}


const INGORE_BUNDLE_CODES = [
  `THIS_IS_UNDEFINED`, `NON_EXISTENT_EXPORT`
];

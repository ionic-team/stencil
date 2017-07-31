import { BuildConfig, Diagnostic, PrintLine } from '../interfaces';
import { formatFileName, formatHeader, splitLineBreaks } from './logger-util';
import { highlight } from './highlight/highlight';


export function loadRollupDiagnostics(config: BuildConfig, resultsDiagnostics: Diagnostic[], rollupError: any) {
  const d: Diagnostic = {
    level: 'error',
    type: 'build',
    language: 'javascript',
    header: 'bundle error',
    code: rollupError.code,
    messageText: rollupErrorMessage(rollupError.code),
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
        lineIndex: rollupError.loc.line,
        lineNumber: rollupError.loc.line + 1,
        text: srcLines[rollupError.loc.line],
        html: htmlLines[rollupError.loc.line],
        errorCharStart: rollupError.loc.column,
        errorLength: 1
      };

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


function rollupErrorMessage(code: string) {
  if (code === 'PARSE_ERROR') {
    return 'Parse Error';
  }
  return code;
}


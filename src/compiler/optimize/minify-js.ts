import type * as d from '../../declarations';
import { splitLineBreaks } from '@utils';
import { CompressOptions, MangleOptions, ManglePropertiesOptions, MinifyOptions, minify } from 'terser';

export const minifyJs = async (input: string, opts?: MinifyOptions) => {
  const results = {
    output: input,
    sourceMap: null as any,
    diagnostics: [] as d.Diagnostic[],
  };

  if (opts) {
    const mangle = opts.mangle as MangleOptions;
    if (mangle) {
      const mangleProperties = mangle.properties as ManglePropertiesOptions;
      if (mangleProperties && mangleProperties.regex) {
        mangleProperties.regex = new RegExp(mangleProperties.regex);
      }
    }
  }

  try {
    const minifyResults = await minify(input, opts);

    results.output = minifyResults.code;

    const compress = opts.compress as CompressOptions;
    if (compress && compress.module && results.output.endsWith('};')) {
      results.output = results.output.substring(0, results.output.length - 1);
    }
  } catch (e) {
    console.log(e.stack)
    loadMinifyJsDiagnostics(input, results.diagnostics, e);
  }

  return results;
};

const loadMinifyJsDiagnostics = (sourceText: string, diagnostics: d.Diagnostic[], error: any) => {
  const d: d.Diagnostic = {
    level: 'error',
    type: 'build',
    language: 'javascript',
    header: 'Minify JS',
    code: '',
    messageText: error.message,
    absFilePath: null,
    relFilePath: null,
    lines: [],
  };

  const err: {
    col: number;
    filename: string;
    line: number;
    message: string;
    name: string;
    pos: number;
    stack: string;
  } = error;

  if (typeof err.line === 'number' && err.line > -1) {
    const srcLines = splitLineBreaks(sourceText);

    const errorLine: d.PrintLine = {
      lineIndex: err.line - 1,
      lineNumber: err.line,
      text: srcLines[err.line - 1],
      errorCharStart: err.col,
      errorLength: 0,
    };

    d.lineNumber = errorLine.lineNumber;
    d.columnNumber = errorLine.errorCharStart;

    const highlightLine = errorLine.text.substr(d.columnNumber);
    for (let i = 0; i < highlightLine.length; i++) {
      if (MINIFY_CHAR_BREAK.has(highlightLine.charAt(i))) {
        break;
      }
      errorLine.errorLength++;
    }

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
        errorLength: -1,
      };

      d.lines.unshift(previousLine);
    }

    if (errorLine.lineIndex + 1 < srcLines.length) {
      const nextLine: d.PrintLine = {
        lineIndex: errorLine.lineIndex + 1,
        lineNumber: errorLine.lineNumber + 1,
        text: srcLines[errorLine.lineIndex + 1],
        errorCharStart: -1,
        errorLength: -1,
      };

      d.lines.push(nextLine);
    }
  }

  diagnostics.push(d);
};

const MINIFY_CHAR_BREAK = new Set([' ', '=', '.', ',', '?', ':', ';', '(', ')', '{', '}', '[', ']', '|', `'`, `"`, '`']);

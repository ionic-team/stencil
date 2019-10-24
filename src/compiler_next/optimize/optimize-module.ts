import * as d from '../../declarations';
import { splitLineBreaks } from '@utils';
import { CompilerCtx, Config, Diagnostic, SourceTarget } from '../../declarations';
import { compilerBuild } from '../../version';
import terser from 'terser';


export async function optimizeModule(config: Config, compilerCtx: CompilerCtx, sourceTarget: SourceTarget, isCore: boolean, input: string) {
  const isDebug = (config.logLevel === 'debug');

  const opts = getTerserOptions(sourceTarget, isDebug);

  if (sourceTarget !== 'es5' && isCore) {
    if (!isDebug) {
      opts.compress.passes = 3;
      opts.compress.global_defs = {
        supportsListenerOptions: true,
        'plt.$cssShim$': false
      };
      opts.compress.pure_funcs = ['getHostRef', ...opts.compress.pure_funcs];
    }

    opts.mangle.properties = {
      regex: '^\\$.+\\$$',
      debug: isDebug
    };
  }

  let cacheKey: string;
  if (compilerCtx) {
    cacheKey = await compilerCtx.cache.createKey('minifyModule', compilerBuild.minfyJsId, opts, input);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
      return {
        output: cachedContent,
        diagnostics: [] as Diagnostic[]
      };
    }
  }

  const results = await compilerCtx.worker.minifyJs(input, opts);
  if (results != null && typeof results.output === 'string' && results.diagnostics.length === 0 && compilerCtx != null) {
    if (isCore) {
      results.output = results.output
        .replace(/disconnectedCallback\(\)\{\}/g, '');
    }
    await compilerCtx.cache.put(cacheKey, results.output);
  }

  return results;
}


export const getTerserOptions = (sourceTarget: SourceTarget, isDebug: boolean) => {
  const opts: any = {
    safari10: true,
    output: {},
  };

  if (sourceTarget === 'es5') {
    opts.ecma = opts.output.ecma = 5;
    opts.compress = false;
    opts.mangle = true;

  } else {
    opts.mangle = {
      properties: {
        regex: '^\\$.+\\$$'
      }
    };
    opts.compress = {
      pure_getters: true,
      keep_fargs: false,
      passes: 2,
      pure_funcs: [
        'console.debug'
      ]
    };

    opts.ecma = opts.output.ecma = opts.compress.ecma = 7;
    opts.toplevel = true;
    opts.module = true;
    opts.compress.toplevel = true;
    opts.mangle.toplevel = true;
    opts.compress.arrows = true;
    opts.compress.module = true;
  }

  if (isDebug) {
    opts.mangle = {keep_fnames: true};
    opts.compress = {};
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.compress.pure_funcs = [];
    opts.output.beautify = true;
    opts.output.indent_level = 2;
    opts.output.comments = 'all';
  }

  return opts;
};


export const minifyJs = async (input: string, opts?: any)  => {
  if (opts && opts.mangle && opts.mangle.properties && opts.mangle.properties.regex) {
    opts.mangle.properties.regex = new RegExp(opts.mangle.properties.regex);
  }
  const result = terser.minify(input, opts);
  const diagnostics = loadMinifyJsDiagnostics(input, result);

  return {
    output: result.code,
    sourceMap: result.map as any,
    diagnostics: diagnostics
  };
};


const loadMinifyJsDiagnostics = (sourceText: string, result: terser.MinifyOutput) => {
  const diagnostics: d.Diagnostic[] = [];
  if (!result || !result.error) {
    return diagnostics;
  }

  const d: d.Diagnostic = {
    level: 'error',
    type: 'build',
    language: 'javascript',
    header: 'Minify JS',
    code: '',
    messageText: result.error.message,
    absFilePath: null,
    relFilePath: null,
    lines: []
  };

  const err: {
    col: number;
    filename: string;
    line: number;
    message: string;
    name: string;
    pos: number;
    stack: string;
  } = result.error as any;

  if (typeof err.line === 'number' && err.line > -1) {
    const srcLines = splitLineBreaks(sourceText);

    const errorLine: d.PrintLine = {
      lineIndex: err.line - 1,
      lineNumber: err.line,
      text: srcLines[err.line - 1],
      errorCharStart: err.col,
      errorLength: 0
    };

    d.lineNumber = errorLine.lineNumber;
    d.columnNumber = errorLine.errorCharStart;

    const highlightLine = errorLine.text.substr(d.columnNumber);
    for (let i = 0; i < highlightLine.length; i++) {
      if (CHAR_BREAK.has(highlightLine.charAt(i))) {
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
        errorLength: -1
      };

      d.lines.unshift(previousLine);
    }

    if (errorLine.lineIndex + 1 < srcLines.length) {
      const nextLine: d.PrintLine = {
        lineIndex: errorLine.lineIndex + 1,
        lineNumber: errorLine.lineNumber + 1,
        text: srcLines[errorLine.lineIndex + 1],
        errorCharStart: -1,
        errorLength: -1
      };

      d.lines.push(nextLine);
    }
  }

  diagnostics.push(d);

  return diagnostics;
};

const CHAR_BREAK = new Set([' ', '=', '.', ',', '?', ':', ';', '(', ')', '{', '}', '[', ']', '|', `'`, `"`, '`']);


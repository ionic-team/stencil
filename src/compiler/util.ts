import { BANNER } from '../util/constants';
import { CompilerCtx, Config, Diagnostic, SourceTarget } from '../declarations';


/**
 * Test if a file is a typescript source file, such as .ts or .tsx.
 * However, d.ts files and spec.ts files return false.
 * @param filePath
 */
export function isTsFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 1) {
    if (parts[parts.length - 1] === 'ts' || parts[parts.length - 1] === 'tsx') {
      if (parts.length > 2 && (parts[parts.length - 2] === 'd' || parts[parts.length - 2] === 'spec')) {
        return false;
      }
      return true;
    }
  }
  return false;
}


export function isDtsFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 2) {
    return (parts[parts.length - 2] === 'd' && parts[parts.length - 1] === 'ts');
  }
  return false;
}


export function isJsFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 1) {
    if (parts[parts.length - 1] === 'js') {
      if (parts.length > 2 && parts[parts.length - 2] === 'spec') {
        return false;
      }
      return true;
    }
  }
  return false;
}


export function hasFileExtension(filePath: string, extensions: string[]) {
  filePath = filePath.toLowerCase();
  return extensions.some(ext => filePath.endsWith('.' + ext));
}


export function isCssFile(filePath: string) {
  return hasFileExtension(filePath, ['css']);
}


export function isHtmlFile(filePath: string) {
  return hasFileExtension(filePath, ['html', 'htm']);
}

/**
 * Only web development text files, like ts, tsx,
 * js, html, css, scss, etc.
 * @param filePath
 */
export function isWebDevFile(filePath: string) {
  return (hasFileExtension(filePath, WEB_DEV_EXT) || isTsFile(filePath));
}
const WEB_DEV_EXT = ['js', 'jsx', 'html', 'htm', 'css', 'scss', 'sass', 'less', 'styl', 'pcss'];


export async function minifyJs(config: Config, compilerCtx: CompilerCtx, jsText: string, sourceTarget: SourceTarget, preamble: boolean) {
  const opts: any = { output: {}, compress: {}, mangle: true };

  if (sourceTarget === 'es5') {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;
    opts.output.beautify = false;

  } else {
    opts.ecma = 6;
    opts.output.ecma = 6;
    opts.compress.ecma = 6;
    opts.toplevel = true;
    opts.compress.arrows = true;
    opts.output.beautify = false;
  }

  if (config.logLevel === 'debug') {
    opts.mangle = {};
    opts.mangle.keep_fnames = true;
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.output.beautify = true;
    opts.output.bracketize = true;
    opts.output.indent_level = 2;
    opts.output.comments = 'all';
    opts.output.preserve_line = true;
  } else {
    opts.compress.pure_funcs = ['assert', 'console.debug'];
  }

  opts.compress.passes = 2;

  if (preamble) {
    opts.output.preamble = generatePreamble(config);
  }

  const cacheKey = compilerCtx.cache.createKey('minifyJs', opts, jsText);
  const cachedContent = await compilerCtx.cache.get(cacheKey);
  if (cachedContent != null) {
    return {
      output: cachedContent,
      diagnostics: []
    };
  }

  const r = config.sys.minifyJs(jsText, opts);
  if (r && r.diagnostics.length === 0 && typeof r.output === 'string') {
    await compilerCtx.cache.put(cacheKey, r.output);
  }
  return r;
}

export function generatePreamble(config: Config) {
  let preamble: string[] = [];

  if (config.preamble) {
    preamble = config.preamble.split('\n');
  }

  preamble.push(BANNER);

  if (preamble.length > 1) {
    preamble = preamble.map(l => ` * ${l}`);

    preamble.unshift(`/*!`);
    preamble.push(` */`);

    return preamble.join('\n');
  }

  return `/*! ${BANNER} */`;
}


export function buildError(diagnostics: Diagnostic[]) {
  const d: Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'build error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  diagnostics.push(d);

  return d;
}


export function buildWarn(diagnostics: Diagnostic[]) {
  const d: Diagnostic = {
    level: 'warn',
    type: 'build',
    header: 'build warn',
    messageText: 'build warn',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  diagnostics.push(d);

  return d;
}


export function catchError(diagnostics: Diagnostic[], err: Error) {
  const d: Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'build error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (err) {
    if (err.stack) {
      d.messageText = err.stack.toString();

    } else {
      if (err.message) {
        d.messageText = err.message.toString();

      } else {
        d.messageText = err.toString();
      }
    }
  }

  diagnostics.push(d);

  return d;
}


export function hasError(diagnostics: Diagnostic[]): boolean {
  if (!diagnostics) {
    return false;
  }
  return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
}


export function pathJoin(config: Config, ...paths: string[]) {
  return normalizePath(config.sys.path.join.apply(config.sys.path, paths));
}


export function normalizePath(str: string) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus
  if (typeof str !== 'string') {
    throw new Error(`invalid path to normalize`);
  }
  str = str.trim();

  if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
    return str;
  }

  str = str.replace(SLASH_REGEX, '/');

  // always remove the trailing /
  // this makes our file cache look ups consistent
  if (str.charAt(str.length - 1) === '/') {
    const colonIndex = str.indexOf(':');
    if (colonIndex > -1) {
      if (colonIndex < str.length - 2) {
        str = str.substring(0, str.length - 1);
      }

    } else if (str.length > 1) {
      str = str.substring(0, str.length - 1);
    }
  }

  return str;
}

const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
const NON_ASCII_REGEX = /[^\x00-\x80]+/;
const SLASH_REGEX = /\\/g;

import * as d from '../declarations';
import { BANNER } from '../util/constants';


export function hasServiceWorkerChanges(config: d.Config, buildCtx: d.BuildCtx) {
  if (config.devMode && !config.flags.serviceWorker) {
    return false;
  }
  const wwwServiceOutputs = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.type === 'www' && o.serviceWorker && o.serviceWorker.swSrc);
  return wwwServiceOutputs.some(outputTarget => {
    return buildCtx.filesChanged.some(fileChanged => config.sys.path.basename(fileChanged).toLowerCase() === config.sys.path.basename(outputTarget.serviceWorker.swSrc).toLowerCase());
  });
}

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


export function generatePreamble(config: d.Config, opts: { prefix?: string; suffix?: string } = {}) {
  let preamble: string[] = [];

  if (config.preamble) {
    preamble = config.preamble.split('\n');
  }

  if (typeof opts.prefix === 'string') {
    opts.prefix.split('\n').forEach(c => {
      preamble.push(c);
    });
  }

  preamble.push(BANNER);

  if (typeof opts.suffix === 'string') {
    opts.suffix.split('\n').forEach(c => {
      preamble.push(c);
    });
  }

  if (preamble.length > 1) {
    preamble = preamble.map(l => ` * ${l}`);

    preamble.unshift(`/*!`);
    preamble.push(` */`);

    return preamble.join('\n');
  }

  return `/*! ${BANNER} */`;
}


export function buildError(diagnostics: d.Diagnostic[]) {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'Build Error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  diagnostics.push(diagnostic);

  return diagnostic;
}


export function buildWarn(diagnostics: d.Diagnostic[]) {
  const diagnostic: d.Diagnostic = {
    level: 'warn',
    type: 'build',
    header: 'build warn',
    messageText: 'build warn',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  diagnostics.push(diagnostic);

  return diagnostic;
}


export function catchError(diagnostics: d.Diagnostic[], err: Error, msg?: string) {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'Build Error',
    messageText: 'build error',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (typeof msg === 'string') {
    diagnostic.messageText = msg;

  } else if (err) {
    if (err.stack) {
      diagnostic.messageText = err.stack.toString();

    } else {
      if (err.message) {
        diagnostic.messageText = err.message.toString();

      } else {
        diagnostic.messageText = err.toString();
      }
    }
  }

  if (diagnostics && !shouldIgnoreError(diagnostic.messageText)) {
    diagnostics.push(diagnostic);
  }
}


export const TASK_CANCELED_MSG = `task canceled`;


export function shouldIgnoreError(msg: any) {
  return (msg === TASK_CANCELED_MSG);
}


export function hasError(diagnostics: d.Diagnostic[]): boolean {
  if (!diagnostics) {
    return false;
  }
  return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
}

export function hasWarning(diagnostics: d.Diagnostic[]): boolean {
  if (!diagnostics) {
    return false;
  }
  return diagnostics.some(d => d.level === 'warn');
}

export function pathJoin(config: d.Config, ...paths: string[]) {
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

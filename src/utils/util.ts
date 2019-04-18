import * as d from '../declarations';
import { BANNER } from './constants';
import { buildError } from './message-utils';


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


export function generatePreamble(config: d.Config, opts: { prefix?: string; suffix?: string, defaultBanner?: boolean } = {}) {
  let preamble: string[] = [];

  if (config.preamble) {
    preamble = config.preamble.split('\n');
  }

  if (typeof opts.prefix === 'string') {
    opts.prefix.split('\n').forEach(c => {
      preamble.push(c);
    });
  }

  if (opts.defaultBanner === true)  {
    preamble.push(BANNER);
  }

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


  if (opts.defaultBanner === true)  {
    return `/*! ${BANNER} */`;
  }
  return '';
}


export function isDocsPublic(jsDocs: d.JsDoc | d.CompilerJsDoc | undefined) {
  return !(jsDocs && jsDocs.tags.some((s) => s.name === 'internal'));
}


export function getDependencies(buildCtx: d.BuildCtx) {
  if (buildCtx.packageJson.dependencies) {
    return Object.keys(buildCtx.packageJson.dependencies)
      .filter(pkgName => !SKIP_DEPS.includes(pkgName));
  }
  return [];
}

export function hasDependency(buildCtx: d.BuildCtx, depName: string) {
  return getDependencies(buildCtx).includes(depName);
}

export async function readPackageJson(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const pkgJsonPath = config.sys.path.join(config.rootDir, 'package.json');

  let pkgJson: string;
  try {
    pkgJson = await compilerCtx.fs.readFile(pkgJsonPath);

  } catch (e) {
    const diagnostic = buildError(buildCtx.diagnostics);
    diagnostic.header = `Missing "package.json"`;
    diagnostic.messageText = `Valid "package.json" file is required for distribution: ${pkgJsonPath}`;
    return null;
  }

  let pkgData: d.PackageJsonData;
  try {
    pkgData = JSON.parse(pkgJson);

  } catch (e) {
    const diagnostic = buildError(buildCtx.diagnostics);
    diagnostic.header = `Error parsing "package.json"`;
    diagnostic.messageText = `${pkgJsonPath}, ${e}`;
    return null;
  }

  return pkgData;
}

const SKIP_DEPS = ['@stencil/core'];

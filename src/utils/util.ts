import * as d from '../declarations';
import { BANNER } from './constants';
import { buildError } from './message-utils';


export const getFileExt = (fileName: string) => {
  if (typeof fileName === 'string') {
    const parts = fileName.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toLowerCase();
    }
  }
  return null;
};

/**
 * Test if a file is a typescript source file, such as .ts or .tsx.
 * However, d.ts files and spec.ts files return false.
 * @param filePath
 */
export const isTsFile = (filePath: string) => {
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
};


export const isDtsFile = (filePath: string) => {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 2) {
    return (parts[parts.length - 2] === 'd' && parts[parts.length - 1] === 'ts');
  }
  return false;
};


export const isJsFile = (filePath: string) => {
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
};


export const hasFileExtension = (filePath: string, extensions: string[]) => {
  filePath = filePath.toLowerCase();
  return extensions.some(ext => filePath.endsWith('.' + ext));
};


export const isCssFile = (filePath: string) => {
  return hasFileExtension(filePath, ['css']);
};


export const isHtmlFile = (filePath: string) => {
  return hasFileExtension(filePath, ['html', 'htm']);
};

/**
 * Only web development text files, like ts, tsx,
 * js, html, css, scss, etc.
 * @param filePath
 */
export const isWebDevFile = (filePath: string) => {
  return (hasFileExtension(filePath, WEB_DEV_EXT) || isTsFile(filePath));
};
const WEB_DEV_EXT = ['js', 'jsx', 'html', 'htm', 'css', 'scss', 'sass', 'less', 'styl', 'pcss'];


export const generatePreamble = (config: d.Config, opts: { prefix?: string; suffix?: string, defaultBanner?: boolean } = {}) => {
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
};


export const isDocsPublic = (jsDocs: d.JsDoc | d.CompilerJsDoc | undefined) => {
  return !(jsDocs && jsDocs.tags.some((s) => s.name === 'internal'));
};

const lineBreakRegex = /\r?\n|\r/g;
export function getTextDocs(docs: d.CompilerJsDoc | undefined | null) {
  if (docs == null) {
    return '';
  }
  return `${docs.text.replace(lineBreakRegex, ' ')}
${docs.tags
  .filter(tag => tag.name !== 'internal')
  .map(tag => `@${tag.name} ${(tag.text || '').replace(lineBreakRegex, ' ')}`)
  .join('\n')}`.trim();
}

export const getDependencies = (buildCtx: d.BuildCtx) => {
  if (buildCtx.packageJson != null && buildCtx.packageJson.dependencies != null) {
    return Object.keys(buildCtx.packageJson.dependencies)
      .filter(pkgName => !SKIP_DEPS.includes(pkgName));
  }
  return [];
};

export const hasDependency = (buildCtx: d.BuildCtx, depName: string) => {
  return getDependencies(buildCtx).includes(depName);
};

export const getDynamicImportFunction = (namespace: string) => {
  return `__sc_import_${
    namespace.replace(/\s|-/g, '_')
  }`;
};

export const readPackageJson = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const pkgJsonPath = config.sys.path.join(config.rootDir, 'package.json');

  let pkgJson: string;
  try {
    pkgJson = await compilerCtx.fs.readFile(pkgJsonPath);

  } catch (e) {
    if (!config.outputTargets.some(o => o.type.includes('dist'))) {
      const diagnostic = buildError(buildCtx.diagnostics);
      diagnostic.header = `Missing "package.json"`;
      diagnostic.messageText = `Valid "package.json" file is required for distribution: ${pkgJsonPath}`;
    }
    return null;
  }

  let pkgData: d.PackageJsonData;
  try {
    pkgData = JSON.parse(pkgJson);

  } catch (e) {
    const diagnostic = buildError(buildCtx.diagnostics);
    diagnostic.header = `Error parsing "package.json"`;
    diagnostic.messageText = `${pkgJsonPath}, ${e}`;
    diagnostic.absFilePath = pkgJsonPath;
    return null;
  }

  buildCtx.packageJsonFilePath = pkgJsonPath;
  return pkgData;
};

const SKIP_DEPS = ['@stencil/core'];

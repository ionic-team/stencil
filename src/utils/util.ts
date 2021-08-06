import type * as d from '../declarations';
import { BANNER } from './constants';
import { buildError } from './message-utils';
import { dashToPascalCase, isString, toDashCase } from './helpers';

export const createJsVarName = (fileName: string) => {
  if (isString(fileName)) {
    fileName = fileName.split('?')[0];
    fileName = fileName.split('#')[0];
    fileName = fileName.split('&')[0];
    fileName = fileName.split('=')[0];
    fileName = toDashCase(fileName);
    fileName = fileName.replace(/[|;$%@"<>()+,.{}_\!\/\\]/g, '-');
    fileName = dashToPascalCase(fileName);

    if (fileName.length > 1) {
      fileName = fileName[0].toLowerCase() + fileName.substr(1);
    } else {
      fileName = fileName.toLowerCase();
    }

    if (fileName.length > 0 && !isNaN(fileName[0] as any)) {
      fileName = '_' + fileName;
    }
  }
  return fileName;
};

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
    return parts[parts.length - 2] === 'd' && parts[parts.length - 1] === 'ts';
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
  return extensions.some((ext) => filePath.endsWith('.' + ext));
};

export const isCssFile = (filePath: string) => {
  return hasFileExtension(filePath, ['css']);
};

export const isHtmlFile = (filePath: string) => {
  return hasFileExtension(filePath, ['html', 'htm']);
};

export const generatePreamble = (
  config: d.Config,
  opts: { prefix?: string; suffix?: string; defaultBanner?: boolean } = {}
) => {
  let preamble: string[] = [];

  if (config.preamble) {
    preamble = config.preamble.split('\n');
  }

  if (typeof opts.prefix === 'string') {
    opts.prefix.split('\n').forEach((c) => {
      preamble.push(c);
    });
  }

  if (opts.defaultBanner === true) {
    preamble.push(BANNER);
  }

  if (typeof opts.suffix === 'string') {
    opts.suffix.split('\n').forEach((c) => {
      preamble.push(c);
    });
  }

  if (preamble.length > 1) {
    preamble = preamble.map((l) => ` * ${l}`);

    preamble.unshift(`/*!`);
    preamble.push(` */`);

    return preamble.join('\n');
  }

  if (opts.defaultBanner === true) {
    return `/*! ${BANNER} */`;
  }
  return '';
};

const lineBreakRegex = /\r?\n|\r/g;
export function getTextDocs(docs: d.CompilerJsDoc | undefined | null) {
  if (docs == null) {
    return '';
  }
  return `${docs.text.replace(lineBreakRegex, ' ')}
${docs.tags
  .filter((tag) => tag.name !== 'internal')
  .map((tag) => `@${tag.name} ${(tag.text || '').replace(lineBreakRegex, ' ')}`)
  .join('\n')}`.trim();
}

export const getDependencies = (buildCtx: d.BuildCtx) => {
  if (buildCtx.packageJson != null && buildCtx.packageJson.dependencies != null) {
    return Object.keys(buildCtx.packageJson.dependencies).filter((pkgName) => !SKIP_DEPS.includes(pkgName));
  }
  return [];
};

export const hasDependency = (buildCtx: d.BuildCtx, depName: string) => {
  return getDependencies(buildCtx).includes(depName);
};

export const getDynamicImportFunction = (namespace: string) => `__sc_import_${namespace.replace(/\s|-/g, '_')}`;

export const readPackageJson = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  try {
    const pkgJson = await compilerCtx.fs.readFile(config.packageJsonFilePath);

    if (pkgJson) {
      const parseResults = parsePackageJson(pkgJson, config.packageJsonFilePath);
      if (parseResults.diagnostic) {
        buildCtx.diagnostics.push(parseResults.diagnostic);
      } else {
        buildCtx.packageJson = parseResults.data;
      }
    }
  } catch (e) {
    if (!config.outputTargets.some((o) => o.type.includes('dist'))) {
      const diagnostic = buildError(buildCtx.diagnostics);
      diagnostic.header = `Missing "package.json"`;
      diagnostic.messageText = `Valid "package.json" file is required for distribution: ${config.packageJsonFilePath}`;
    }
  }
};

export const parsePackageJson = (
  pkgJsonStr: string,
  pkgJsonFilePath: string
): { diagnostic: d.Diagnostic; data: d.PackageJsonData; filePath: string } => {
  if (isString(pkgJsonFilePath)) {
    return parseJson(pkgJsonStr, pkgJsonFilePath);
  }
  return null;
};

export const parseJson = (jsonStr: string, filePath?: string) => {
  const rtn = {
    diagnostic: null as d.Diagnostic,
    data: null as any,
    filePath,
  };

  if (isString(jsonStr)) {
    try {
      rtn.data = JSON.parse(jsonStr);
    } catch (e) {
      const msg = e.message;
      rtn.diagnostic = buildError();
      rtn.diagnostic.absFilePath = filePath;
      rtn.diagnostic.header = `Error Parsing JSON`;
      rtn.diagnostic.messageText = msg;
    }
  } else {
    rtn.diagnostic = buildError();
    rtn.diagnostic.absFilePath = filePath;
    rtn.diagnostic.header = `Error Parsing JSON`;
    rtn.diagnostic.messageText = `Invalid JSON input to parse`;
  }

  return rtn;
};

const SKIP_DEPS = ['@stencil/core'];

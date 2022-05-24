import type * as d from '../declarations';
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
      fileName = fileName[0].toLowerCase() + fileName.slice(1);
    } else {
      fileName = fileName.toLowerCase();
    }

    if (fileName.length > 0 && !isNaN(fileName[0] as any)) {
      fileName = '_' + fileName;
    }
  }
  return fileName;
};

/**
 * Determines if a given file path points to a type declaration file (ending in .d.ts) or not. This function is
 * case-insensitive in its heuristics.
 * @param filePath the path to check
 * @returns `true` if the given `filePath` points to a type declaration file, `false` otherwise
 */
export const isDtsFile = (filePath: string): boolean => {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 2) {
    return parts[parts.length - 2] === 'd' && parts[parts.length - 1] === 'ts';
  }
  return false;
};

/**
 * Generate the preamble to be placed atop the main file of the build
 * @param config the Stencil configuration file
 * @return the generated preamble
 */
export const generatePreamble = (config: d.Config): string => {
  const { preamble } = config;

  if (!preamble) {
    return '';
  }

  // generate the body of the JSDoc-style comment
  const preambleComment: string[] = preamble.split('\n').map((l) => ` * ${l}`);

  preambleComment.unshift(`/*!`);
  preambleComment.push(` */`);

  return preambleComment.join('\n');
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
      rtn.diagnostic = buildError();
      rtn.diagnostic.absFilePath = filePath;
      rtn.diagnostic.header = `Error Parsing JSON`;
      if (e instanceof Error) {
        rtn.diagnostic.messageText = e.message;
      }
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

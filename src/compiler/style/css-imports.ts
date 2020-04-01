import * as d from '../../declarations';
import { basename, dirname, isAbsolute, join, relative } from 'path';
import { buildError, normalizePath } from '@utils';
import { parseStyleDocs } from '../docs/style-docs';
import { resolveModuleIdAsync } from '../sys/resolve/resolve-module-async';
import { stripCssComments } from './style-utils';

export const parseCssImports = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  srcFilePath: string,
  resolvedFilePath: string,
  styleText: string,
  styleDocs?: d.StyleDoc[],
) => {
  const isCssEntry = resolvedFilePath.toLowerCase().endsWith('.css');
  return cssImports(config, compilerCtx, buildCtx, isCssEntry, srcFilePath, resolvedFilePath, styleText, new Set(), styleDocs);
};

const cssImports = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  isCssEntry: boolean,
  srcFilePath: string,
  resolvedFilePath: string,
  styleText: string,
  noLoop: Set<string>,
  styleDocs?: d.StyleDoc[],
) => {
  if (noLoop.has(resolvedFilePath)) {
    return styleText;
  }
  noLoop.add(resolvedFilePath);

  if (styleDocs != null) {
    parseStyleDocs(styleDocs, styleText);
  }

  const cssImports = await getCssImports(config, compilerCtx, buildCtx, resolvedFilePath, styleText);
  if (cssImports.length === 0) {
    return styleText;
  }

  await Promise.all(
    cssImports.map(async cssImportData => {
      await concatCssImport(config, compilerCtx, buildCtx, isCssEntry, srcFilePath, cssImportData, noLoop, styleDocs);
    }),
  );

  return replaceImportDeclarations(styleText, cssImports, isCssEntry);
};

const concatCssImport = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  isCssEntry: boolean,
  srcFilePath: string,
  cssImportData: d.CssImportData,
  noLoop: Set<string>,
  styleDocs?: d.StyleDoc[],
) => {
  cssImportData.styleText = await loadStyleText(compilerCtx, cssImportData);

  if (typeof cssImportData.styleText === 'string') {
    cssImportData.styleText = await cssImports(
      config,
      compilerCtx,
      buildCtx,
      isCssEntry,
      cssImportData.filePath,
      cssImportData.filePath,
      cssImportData.styleText,
      noLoop,
      styleDocs,
    );
  } else {
    const err = buildError(buildCtx.diagnostics);
    err.messageText = `Unable to read css import: ${cssImportData.srcImport}`;
    err.absFilePath = srcFilePath;
  }
};

const loadStyleText = async (compilerCtx: d.CompilerCtx, cssImportData: d.CssImportData) => {
  let styleText: string = null;

  try {
    styleText = await compilerCtx.fs.readFile(cssImportData.filePath);
  } catch (e) {
    if (cssImportData.altFilePath) {
      try {
        styleText = await compilerCtx.fs.readFile(cssImportData.filePath);
      } catch (e) {}
    }
  }

  return styleText;
};

export const getCssImports = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, styleText: string) => {
  const imports: d.CssImportData[] = [];

  if (!styleText.includes('@import')) {
    // no @import at all, so don't bother
    return imports;
  }
  styleText = stripCssComments(styleText);

  const dir = dirname(filePath);
  const importeeExt = filePath
    .split('.')
    .pop()
    .toLowerCase();

  let r: RegExpExecArray;
  while ((r = IMPORT_RE.exec(styleText))) {
    const cssImportData: d.CssImportData = {
      srcImport: r[0],
      url: r[4].replace(/[\"\'\)]/g, ''),
    };

    if (!isLocalCssImport(cssImportData.srcImport)) {
      // do nothing for @import url(http://external.css)
      config.logger.debug(`did not resolve external css @import: ${cssImportData.srcImport}`);
      continue;
    }

    if (isCssNodeModule(cssImportData.url)) {
      // node resolve this path cuz it starts with ~
      await resolveCssNodeModule(config, compilerCtx, buildCtx.diagnostics, filePath, cssImportData);
    } else if (isAbsolute(cssImportData.url)) {
      // absolute path already
      cssImportData.filePath = normalizePath(cssImportData.url);
    } else {
      // relative path
      cssImportData.filePath = normalizePath(join(dir, cssImportData.url));
    }

    if (importeeExt !== 'css' && !cssImportData.filePath.toLowerCase().endsWith('.css')) {
      cssImportData.filePath += `.${importeeExt}`;

      if (importeeExt === 'scss') {
        const fileName = '_' + basename(cssImportData.filePath);
        const dirPath = dirname(cssImportData.filePath);

        cssImportData.altFilePath = normalizePath(join(dirPath, fileName));
      }
    }

    if (typeof cssImportData.filePath === 'string') {
      imports.push(cssImportData);
    }
  }

  return imports;
};

const IMPORT_RE = /(@import)\s+(url\()?\s?(.*?)\s?\)?([^;]*);?/gi;

export const isCssNodeModule = (url: string) => url.startsWith('~');

export const resolveCssNodeModule = async (config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], filePath: string, cssImportData: d.CssImportData) => {
  try {
    const m = getModuleId(cssImportData.url);
    const resolved = await resolveModuleIdAsync(config.sys, compilerCtx.fs, {
      moduleId: m.moduleId,
      containingFile: filePath,
      exts: [],
      packageFilter: pkg => {
        if (m.filePath !== '') {
          pkg.main = m.filePath;
        }
        return pkg;
      },
    });

    cssImportData.filePath = resolved.resolveId;
    cssImportData.updatedImport = `@import "${cssImportData.filePath}";`;
  } catch (e) {
    const d = buildError(diagnostics);
    d.messageText = `Unable to resolve node module for CSS @import: ${cssImportData.url}`;
    d.absFilePath = filePath;
  }
};

export const isLocalCssImport = (srcImport: string) => {
  srcImport = srcImport.toLowerCase();

  if (srcImport.includes('url(')) {
    srcImport = srcImport.replace(/\"/g, '');
    srcImport = srcImport.replace(/\'/g, '');
    srcImport = srcImport.replace(/\s/g, '');
    if (srcImport.includes('url(http') || srcImport.includes('url(//')) {
      return false;
    }
  }

  return true;
};

export const replaceNodeModuleUrl = (baseCssFilePath: string, moduleId: string, nodeModulePath: string, url: string) => {
  nodeModulePath = normalizePath(dirname(nodeModulePath));
  url = normalizePath(url);

  const absPathToNodeModuleCss = normalizePath(url.replace(`~${moduleId}`, nodeModulePath));

  const baseCssDir = normalizePath(dirname(baseCssFilePath));

  const relToRoot = normalizePath(relative(baseCssDir, absPathToNodeModuleCss));
  return relToRoot;
};

export const getModuleId = (orgImport: string) => {
  if (orgImport.startsWith('~')) {
    orgImport = orgImport.substring(1);
  }
  const splt = orgImport.split('/');
  const m = {
    moduleId: null as string,
    filePath: null as string,
  };

  if (orgImport.startsWith('@') && splt.length > 1) {
    m.moduleId = splt.slice(0, 2).join('/');
    m.filePath = splt.slice(2).join('/');
  } else {
    m.moduleId = splt[0];
    m.filePath = splt.slice(1).join('/');
  }

  return m;
};

export const replaceImportDeclarations = (styleText: string, cssImports: d.CssImportData[], isCssEntry: boolean) => {
  cssImports.forEach(cssImportData => {
    if (isCssEntry) {
      if (typeof cssImportData.styleText === 'string') {
        styleText = styleText.replace(cssImportData.srcImport, cssImportData.styleText);
      }
    } else if (typeof cssImportData.updatedImport === 'string') {
      styleText = styleText.replace(cssImportData.srcImport, cssImportData.updatedImport);
    }
  });

  return styleText;
};

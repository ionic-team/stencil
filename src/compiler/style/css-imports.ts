import * as d from '../../declarations';
import { buildError, normalizePath } from '@utils';
import { parseStyleDocs } from '../docs/style-docs';
import { stripCssComments } from './style-utils';


export const parseCssImports = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, srcFilePath: string, resolvedFilePath: string, styleText: string, styleDocs?: d.StyleDoc[]) => {
  const isCssEntry = resolvedFilePath.toLowerCase().endsWith('.css');
  return cssImports(config, compilerCtx, buildCtx, isCssEntry, srcFilePath, resolvedFilePath, styleText, [], styleDocs);
};

const cssImports = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, isCssEntry: boolean, srcFilePath: string, resolvedFilePath: string, styleText: string, noLoop: string[], styleDocs?: d.StyleDoc[]) => {
  if (noLoop.includes(resolvedFilePath)) {
    return styleText;
  }
  noLoop.push(resolvedFilePath);

  if (styleDocs != null) {
    parseStyleDocs(styleDocs, styleText);
  }

  const cssImports = getCssImports(config, buildCtx, resolvedFilePath, styleText);
  if (cssImports.length === 0) {
    return styleText;
  }

  await Promise.all(cssImports.map(async cssImportData => {
    await concatCssImport(config, compilerCtx, buildCtx, isCssEntry, srcFilePath, cssImportData, noLoop, styleDocs);
  }));

  return replaceImportDeclarations(styleText, cssImports, isCssEntry);
};

const concatCssImport = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, isCssEntry: boolean, srcFilePath: string, cssImportData: d.CssImportData, noLoop: string[], styleDocs?: d.StyleDoc[]) => {
  cssImportData.styleText = await loadStyleText(compilerCtx, cssImportData);

  if (typeof cssImportData.styleText === 'string') {
    cssImportData.styleText = await cssImports(config, compilerCtx, buildCtx, isCssEntry, cssImportData.filePath, cssImportData.filePath, cssImportData.styleText, noLoop, styleDocs);

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

      } catch (e) { }
    }
  }

  return styleText;
};

export const getCssImports = (config: d.Config, buildCtx: d.BuildCtx, filePath: string, styleText: string) => {
  const imports: d.CssImportData[] = [];

  if (!styleText.includes('@import')) {
    // no @import at all, so don't bother
    return imports;
  }

  styleText = stripCssComments(styleText);

  const dir = config.sys.path.dirname(filePath);
  const importeeExt = filePath.split('.').pop().toLowerCase();

  let r: RegExpExecArray;
  while (r = IMPORT_RE.exec(styleText)) {
    const cssImportData: d.CssImportData = {
      srcImport: r[0],
      url: r[4].replace(/[\"\'\)]/g, '')
    };

    if (!isLocalCssImport(cssImportData.srcImport)) {
      // do nothing for @import url(http://external.css)
      config.logger.debug(`did not resolve external css @import: ${cssImportData.srcImport}`);
      continue;
    }

    if (isCssNodeModule(cssImportData.url)) {
      // node resolve this path cuz it starts with ~
      resolveCssNodeModule(config, buildCtx.diagnostics, filePath, cssImportData);

    } else if (config.sys.path.isAbsolute(cssImportData.url)) {
      // absolute path already
      cssImportData.filePath = normalizePath(cssImportData.url);

    } else {
      // relative path
      cssImportData.filePath = normalizePath(config.sys.path.join(dir, cssImportData.url));
    }

    if (importeeExt !== 'css' && !cssImportData.filePath.toLowerCase().endsWith('.css')) {
      cssImportData.filePath += `.${importeeExt}`;

      if (importeeExt === 'scss') {
        const fileName = '_' + config.sys.path.basename(cssImportData.filePath);
        const dirPath = config.sys.path.dirname(cssImportData.filePath);

        cssImportData.altFilePath = config.sys.path.join(dirPath, fileName);
      }
    }

    if (typeof cssImportData.filePath === 'string') {
      imports.push(cssImportData);
    }
  }

  return imports;
}

const IMPORT_RE = /(@import)\s+(url\()?\s?(.*?)\s?\)?([^;]*);?/gi;

export const isCssNodeModule = (url: string) => {
  return url.startsWith('~');
};

export const resolveCssNodeModule = (config: d.Config, diagnostics: d.Diagnostic[], filePath: string, cssImportData: d.CssImportData) => {
  try {
    const dir = config.sys.path.dirname(filePath);
    const moduleId = getModuleId(cssImportData.url);

    try {
      cssImportData.filePath = config.sys.resolveModule(dir, moduleId, { packageJson: true });
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        // the module might not have a main field in package.json
        cssImportData.filePath = config.sys.resolveModule(dir, moduleId);
      } else {
        throw error;
      }
    }

    cssImportData.filePath = config.sys.path.dirname(cssImportData.filePath);
    cssImportData.filePath += normalizePath(cssImportData.url.substring(moduleId.length + 1));
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

export const replaceNodeModuleUrl = (config: d.Config, baseCssFilePath: string, moduleId: string, nodeModulePath: string, url: string) => {
  nodeModulePath = normalizePath(config.sys.path.dirname(nodeModulePath));
  url = normalizePath(url);

  const absPathToNodeModuleCss = normalizePath(url.replace(`~${moduleId}`, nodeModulePath));

  const baseCssDir = normalizePath(config.sys.path.dirname(baseCssFilePath));

  const relToRoot = normalizePath(config.sys.path.relative(baseCssDir, absPathToNodeModuleCss));
  return relToRoot;
};

export const getModuleId = (orgImport: string) => {
  if (orgImport.startsWith('~')) {
    orgImport = orgImport.substring(1);
  }
  const splt = orgImport.split('/');

  if (orgImport.startsWith('@')) {
    if (splt.length > 1) {
      return splt.slice(0, 2).join('/');
    }
  }

  return splt[0];
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

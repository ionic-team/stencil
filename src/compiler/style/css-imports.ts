import * as d from '../../declarations';
import { buildError, normalizePath } from '../util';
import { parseStyleDocs } from '../docs/style-docs';


export async function parseCssImports(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, srcFilePath: string, resolvedFilePath: string, styleText: string, styleDocs?: d.StyleDoc[]) {
  const isCssEntry = resolvedFilePath.toLowerCase().endsWith('.css');
  return cssImports(config, compilerCtx, buildCtx, isCssEntry, srcFilePath, resolvedFilePath, styleText, [], styleDocs);
}


async function cssImports(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, isCssEntry: boolean, srcFilePath: string, resolvedFilePath: string, styleText: string, noLoop: string[], styleDocs?: d.StyleDoc[]) {
  if (noLoop.includes(resolvedFilePath)) {
    return styleText;
  }
  noLoop.push(resolvedFilePath);

  if (styleDocs) {
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
}


async function concatCssImport(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, isCssEntry: boolean, srcFilePath: string, cssImportData: d.CssImportData, noLoop: string[], styleDocs?: d.StyleDoc[]) {
  try {
    cssImportData.styleText = await compilerCtx.fs.readFile(cssImportData.filePath);
    cssImportData.styleText = await cssImports(config, compilerCtx, buildCtx, isCssEntry, cssImportData.filePath, cssImportData.filePath, cssImportData.styleText, noLoop, styleDocs);

  } catch (e) {
    const err = buildError(buildCtx.diagnostics);
    err.messageText = `Unable to read css import: ${cssImportData.srcImport}`;
    err.absFilePath = normalizePath(srcFilePath);
    err.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, srcFilePath));
  }
}


export function getCssImports(config: d.Config, buildCtx: d.BuildCtx, filePath: string, styleText: string) {
  const imports: d.CssImportData[] = [];

  if (!styleText.includes('@import')) {
    // no @import at all, so don't bother
    return imports;
  }

  styleText = stripComments(styleText);

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
      // relatie path
      cssImportData.filePath = normalizePath(config.sys.path.join(dir, cssImportData.url));
    }

    if (importeeExt !== 'css' && !cssImportData.filePath.toLowerCase().endsWith('.css')) {
      cssImportData.filePath += `.${importeeExt}`;
    }

    if (typeof cssImportData.filePath === 'string') {
      imports.push(cssImportData);
    }
  }

  return imports;
}

const IMPORT_RE = /(@import)\s+(url\()?\s?(.*?)\s?\)?([^;]*);?/gi;


export function isCssNodeModule(url: string) {
  return url.startsWith('~');
}


export function resolveCssNodeModule(config: d.Config, diagnostics: d.Diagnostic[], filePath: string, cssImportData: d.CssImportData) {
  try {
    const dir = config.sys.path.dirname(filePath);
    const moduleId = getModuleId(cssImportData.url);
    cssImportData.filePath = config.sys.resolveModule(dir, moduleId);
    cssImportData.filePath = config.sys.path.dirname(cssImportData.filePath);
    cssImportData.filePath += normalizePath(cssImportData.url.substring(moduleId.length + 1));
    cssImportData.updatedImport = `@import "${cssImportData.filePath}";`;

  } catch (e) {
    const d = buildError(diagnostics);
    d.messageText = `Unable to resolve node module for CSS @import: ${cssImportData.url}`;
    d.absFilePath = normalizePath(filePath);
    d.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, filePath));
  }
}


export function isLocalCssImport(srcImport: string) {
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
}


export function replaceNodeModuleUrl(config: d.Config, baseCssFilePath: string, moduleId: string, nodeModulePath: string, url: string) {
  nodeModulePath = normalizePath(config.sys.path.dirname(nodeModulePath));
  url = normalizePath(url);

  const absPathToNodeModuleCss = normalizePath(url.replace(`~${moduleId}`, nodeModulePath));

  const baseCssDir = normalizePath(config.sys.path.dirname(baseCssFilePath));

  const relToRoot = normalizePath(config.sys.path.relative(baseCssDir, absPathToNodeModuleCss));
  return relToRoot;
}


export function getModuleId(orgImport: string) {
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
}


export function replaceImportDeclarations(styleText: string, cssImports: d.CssImportData[], isCssEntry: boolean) {
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
}

function stripComments(input: string) {
  let isInsideString = null;
  let currentCharacter = '';
  let returnValue = '';

  for (let i = 0; i < input.length; i++) {
    currentCharacter = input[i];

    if (input[i - 1] !== '\\') {
      if (currentCharacter === '"' || currentCharacter === '\'') {
        if (isInsideString === currentCharacter) {
          isInsideString = null;
        } else if (!isInsideString) {
          isInsideString = currentCharacter;
        }
      }
    }

    // Find beginning of /* type comment
    if (!isInsideString && currentCharacter === '/' && input[i + 1] === '*') {
      // Ignore important comment when configured to preserve comments using important syntax: /*!
      let j = i + 2;

      // Iterate over comment
      for (; j < input.length; j++) {
        // Find end of comment
        if (input[j] === '*' && input[j + 1] === '/') {
          break;
        }
      }
      // Resume iteration over CSS string from the end of the comment
      i = j + 1;
      continue;
    }

    returnValue += currentCharacter;
  }
  return returnValue;
}

import * as d from '../../declarations';
import { buildError, catchError, normalizePath } from '../util';


export async function concatCssImports(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, styleText: string, noLoop: string[] = []) {
  if (noLoop.includes(filePath)) {
    return styleText;
  }
  noLoop.push(filePath);

  const cssImports = getCssImports(config, buildCtx, filePath, styleText);
  if (cssImports.length === 0) {
    return styleText;
  }

  await Promise.all(cssImports.map(async cssImportData => {
    await concatCssImport(config, compilerCtx, buildCtx, cssImportData, noLoop);
  }));

  return replaceImportDeclarations(styleText, cssImports);
}


export async function concatCssImport(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cssImportData: d.CssImportData, noLoop: string[]) {
  try {
    cssImportData.styleText = await compilerCtx.fs.readFile(cssImportData.filePath);
    cssImportData.styleText = await concatCssImports(config, compilerCtx, buildCtx, cssImportData.filePath, cssImportData.styleText, noLoop);
  } catch (e) {
    cssImportData.styleText = `/* error importing: ${cssImportData.filePath} */`;
    catchError(buildCtx.diagnostics, e);
  }
}


export function getCssImports(config: d.Config, buildCtx: d.BuildCtx, filePath: string, styleText: string) {
  const imports: d.CssImportData[] = [];

  if (!styleText.includes('@import')) {
    // no @import at all, so don't bother
    return imports;
  }

  const dir = config.sys.path.dirname(filePath);

  let r: RegExpExecArray;
  while (r = IMPORT_RE.exec(styleText)) {
    const cssImportData: d.CssImportData = {
      importDeclaration: r[0],
      url: r[1]
    };

    if (cssImportData.importDeclaration.includes('url(')) {
      continue;
    }

    let wasResolved = false;
    if (cssImportData.url.startsWith('~')) {
      try {
        const moduleId = getModuleId(cssImportData.url);
        cssImportData.filePath = normalizePath(config.sys.resolveModule(dir, moduleId));
        wasResolved = true;

      } catch (e) {
        const d = buildError(buildCtx.diagnostics);
        d.messageText = `Unable to resolve node module for CSS @import: ${cssImportData.url}`;
      }

    } else if (config.sys.path.isAbsolute(cssImportData.url)) {
      cssImportData.filePath = normalizePath(cssImportData.url);

    } else {
      cssImportData.filePath = normalizePath(config.sys.path.join(dir, cssImportData.url));
    }

    if (!wasResolved && !cssImportData.filePath.toLowerCase().endsWith('.css')) {
      const importeeExt = filePath.split('.').pop();
      cssImportData.filePath += `.${importeeExt}`;
    }

    if (typeof cssImportData.filePath === 'string') {
      imports.push(cssImportData);
    }
  }

  return imports;
}

const IMPORT_RE = /(?:@import)\s(?:url\()?\s?["\'](.*?)["\']\s?\)?(?:[^;]*);?/gi;


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


export function replaceImportDeclarations(styleText: string, cssImports: d.CssImportData[]) {
  cssImports.forEach(cssImportData => {
    if (typeof cssImportData.styleText === 'string') {
      styleText = styleText.replace(cssImportData.importDeclaration, cssImportData.styleText);
    }
  });

  return styleText;
}

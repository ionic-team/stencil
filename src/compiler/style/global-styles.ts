import * as d from '../../declarations';
import { buildError, normalizePath } from '@utils';
import { getCssImports } from './css-imports';
import { optimizeCss } from './optimize-css';
import { runPluginTransforms } from '../plugin/plugin';

export async function writeGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, dest: string) {
  if (!buildCtx.globalStyle) {
    return undefined;
  }
  const originalFilename = config.fsNamespace + '.css';
  await compilerCtx.fs.writeFile(config.sys.path.join(dest, originalFilename), buildCtx.globalStyle);

  if (config.hashFileNames) {
    const hashedFilename = 'p-' + config.sys.generateContentHash(buildCtx.globalStyle, config.hashedFileNameLength) + '.css';
    await compilerCtx.fs.writeFile(config.sys.path.join(dest, hashedFilename), buildCtx.globalStyle);
    return hashedFilename;
  }
  return originalFilename;
}

export async function generateGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string) {
  if (!config.globalStyle) {
    return;
  }

  const canSkip = await canSkipGlobalStyles(config, compilerCtx, buildCtx);
  if (canSkip) {
    buildCtx.globalStyle = compilerCtx.cachedGlobalStyle;
    return;
  }

  try {
    filePath = normalizePath(filePath);

    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, filePath);

    buildCtx.globalStyle = compilerCtx.cachedGlobalStyle = await optimizeCss(config, compilerCtx, buildCtx.diagnostics, transformResults.code, filePath, true);

  } catch (e) {
    const d = buildError(buildCtx.diagnostics);
    d.messageText = e + '';
    d.absFilePath = filePath;
    compilerCtx.cachedGlobalStyle = buildCtx.globalStyle = null;
  }
}


async function canSkipGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!compilerCtx.cachedGlobalStyle) {
    return false;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild && !buildCtx.hasStyleChanges) {
    return true;
  }

  if (buildCtx.filesChanged.includes(config.globalStyle)) {
    // changed file IS the global entry style
    return false;
  }

  const hasChangedImports = await hasChangedImportFile(config, compilerCtx, buildCtx, config.globalStyle, []);
  if (hasChangedImports) {
    return false;
  }

  return true;
}


async function hasChangedImportFile(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, noLoop: string[]) {
  if (noLoop.includes(filePath)) {
    return false;
  }
  noLoop.push(filePath);

  let rtn = false;

  try {
    const content = await compilerCtx.fs.readFile(filePath);
    rtn = await hasChangedImportContent(config, compilerCtx, buildCtx, filePath, content, noLoop);
  } catch (e) {}

  return rtn;
}


async function hasChangedImportContent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, content: string, checkedFiles: string[]): Promise<boolean> {
  const cssImports = getCssImports(config, buildCtx, filePath, content);
  if (cssImports.length === 0) {
    // don't bother
    return false;
  }

  const isChangedImport = buildCtx.filesChanged.some(changedFilePath => {
    return cssImports.some(c => c.filePath === changedFilePath);
  });

  if (isChangedImport) {
    // one of the changed files is an import of this file
    return true;
  }

  // keep diggin'
  const promises = cssImports.map(cssImportData => {
    return hasChangedImportFile(config, compilerCtx, buildCtx, cssImportData.filePath, checkedFiles);
  });

  const results = await Promise.all(promises);

  return results.includes(true);
}

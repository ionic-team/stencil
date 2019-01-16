import * as d from '../../declarations';
import { buildError, catchError, normalizePath, pathJoin } from '@stencil/core/utils';
import { getCssImports } from './css-imports';
import { getGlobalStyleFilename } from '../app/app-file-naming';
import { optimizeCss } from './optimize-css';
import { runPluginTransforms } from '../plugin/plugin';


export async function generateGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetBuild) {
  const canSkip = await canSkipGlobalStyles(config, compilerCtx, buildCtx, outputTarget);
  if (canSkip) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`compile global style start`);

  try {
    const styleText = await loadGlobalStyle(config, compilerCtx, buildCtx, config.globalStyle);

    const fileName = getGlobalStyleFilename(config);

    const filePath = pathJoin(config, outputTarget.buildDir, fileName);
    buildCtx.debug(`global style: ${config.sys.path.relative(config.rootDir, filePath)}`);
    await compilerCtx.fs.writeFile(filePath, styleText);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`compile global style finish`);
}


async function loadGlobalStyle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string) {
  let styleText = '';

  try {
    filePath = normalizePath(filePath);

    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, filePath);

    styleText = await optimizeCss(config, compilerCtx, buildCtx.diagnostics, transformResults.code, filePath, true);

  } catch (e) {
    const d = buildError(buildCtx.diagnostics);
    d.messageText = e + '';
    d.absFilePath = normalizePath(filePath);
    d.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, filePath));
  }

  return styleText;
}


async function canSkipGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetBuild) {
  if (typeof config.globalStyle !== 'string') {
    return true;
  }

  if (buildCtx.shouldAbort) {
    return true;
  }

  if (!outputTarget.buildDir) {
    return true;
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

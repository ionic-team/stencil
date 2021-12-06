import type * as d from '../../declarations';
import { catchError, normalizePath } from '@utils';
import { getCssImports } from './css-imports';
import { isOutputTargetDistGlobalStyles } from '../output-targets/output-utils';
import { optimizeCss } from './optimize-css';
import { runPluginTransforms } from '../plugin/plugin';

export const generateGlobalStyles = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistGlobalStyles);
  if (outputTargets.length === 0) {
    return;
  }

  const globalStyles = await buildGlobalStyles(config, compilerCtx, buildCtx);
  if (globalStyles) {
    await Promise.all(outputTargets.map((o) => compilerCtx.fs.writeFile(o.file, globalStyles)));
  }
};

const buildGlobalStyles = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  let globalStylePath = config.globalStyle;
  if (!globalStylePath) {
    return null;
  }

  const canSkip = await canSkipGlobalStyles(config, compilerCtx, buildCtx);
  if (canSkip) {
    return compilerCtx.cachedGlobalStyle;
  }

  try {
    globalStylePath = normalizePath(globalStylePath);
    compilerCtx.addWatchFile(globalStylePath);

    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, globalStylePath);

    if (transformResults) {
      const optimizedCss = await optimizeCss(
        config,
        compilerCtx,
        buildCtx.diagnostics,
        transformResults.code,
        globalStylePath
      );
      compilerCtx.cachedGlobalStyle = optimizedCss;

      if (Array.isArray(transformResults.dependencies)) {
        const cssModuleImports = compilerCtx.cssModuleImports.get(globalStylePath) || [];
        transformResults.dependencies.forEach((dep) => {
          compilerCtx.addWatchFile(dep);
          if (!cssModuleImports.includes(dep)) {
            cssModuleImports.push(dep);
          }
        });
        compilerCtx.cssModuleImports.set(globalStylePath, cssModuleImports);
      }
      return optimizedCss;
    }
  } catch (e) {
    const d = catchError(buildCtx.diagnostics, e);
    d.absFilePath = globalStylePath;
  }

  compilerCtx.cachedGlobalStyle = null;
  return null;
};

const canSkipGlobalStyles = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
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

  const cssModuleImports = compilerCtx.cssModuleImports.get(config.globalStyle);
  if (cssModuleImports && buildCtx.filesChanged.some((f) => cssModuleImports.includes(f))) {
    return false;
  }

  const hasChangedImports = await hasChangedImportFile(
    config,
    compilerCtx,
    buildCtx,
    config.globalStyle,
    compilerCtx.cachedGlobalStyle,
    []
  );
  if (hasChangedImports) {
    return false;
  }

  return true;
};

const hasChangedImportFile = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  filePath: string,
  content: string,
  noLoop: string[]
): Promise<boolean> => {
  if (noLoop.includes(filePath)) {
    return false;
  }
  noLoop.push(filePath);

  return hasChangedImportContent(config, compilerCtx, buildCtx, filePath, content, noLoop);
};

const hasChangedImportContent = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  filePath: string,
  content: string,
  checkedFiles: string[]
) => {
  const cssImports = await getCssImports(config, compilerCtx, buildCtx, filePath, content);
  if (cssImports.length === 0) {
    // don't bother
    return false;
  }

  const isChangedImport = buildCtx.filesChanged.some((changedFilePath) => {
    return cssImports.some((c) => c.filePath === changedFilePath);
  });

  if (isChangedImport) {
    // one of the changed files is an import of this file
    return true;
  }

  // keep diggin'
  const promises = cssImports.map(async (cssImportData) => {
    try {
      const content = await compilerCtx.fs.readFile(cssImportData.filePath);
      return hasChangedImportFile(config, compilerCtx, buildCtx, cssImportData.filePath, content, checkedFiles);
    } catch (e) {
      return false;
    }
  });

  const results = await Promise.all(promises);

  return results.includes(true);
};

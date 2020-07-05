import * as d from '../../declarations';
import { catchError, normalizePath } from '@utils';
import { getCssImports } from './css-imports';
import { isOutputTargetDistGlobalStyles } from '../output-targets/output-utils';
import { optimizeCss } from './optimize-css';
import { runPluginTransforms } from '../plugin/plugin';
import { basename, join } from 'path';

export const generateGlobalStyles = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistGlobalStyles);
  if (outputTargets.length === 0) {
    return;
  }

  const globalStyles: Promise<void>[] = [];
  if (config.globalStyle) {
    globalStyles.push(generateGlobalStyle(config, compilerCtx, buildCtx, outputTargets, config.globalStyle, `${config.fsNamespace}.css`));
  }

  if (config.globalStyles) {
    globalStyles.push(...config.globalStyles.map((globalStyle) => generateGlobalStyle(config, compilerCtx, buildCtx, outputTargets, globalStyle)));
  }

  await Promise.all(globalStyles);
};

const generateGlobalStyle = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistGlobalStyles[], globalStylePath: string, cssFileName?: string): Promise<void> => {
  const globalStyle = await buildGlobalStyle(config, compilerCtx, buildCtx, globalStylePath);
  if (!globalStyle) {
    return;
  }

  const destinationFilePath = basename(cssFileName || globalStyle.id);
  await Promise.all(outputTargets.map(o => compilerCtx.fs.writeFile(join(o.dir, destinationFilePath), globalStyle.code)));
};

const buildGlobalStyle = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, globalStylePath: string): Promise<d.PluginTransformResults> => {
  const canSkip = await canSkipGlobalStyle(config, compilerCtx, buildCtx, globalStylePath);
  if (canSkip) {
    return compilerCtx.cachedGlobalStyles.get(globalStylePath);
  }

  try {
    globalStylePath = normalizePath(globalStylePath);

    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, globalStylePath);

    if (transformResults) {
      transformResults.code = await optimizeCss(config, compilerCtx, buildCtx.diagnostics, transformResults.code, globalStylePath);
      compilerCtx.cachedGlobalStyles = (compilerCtx.cachedGlobalStyles || new Map()).set(globalStylePath, transformResults);
      return transformResults;
    }
  } catch (e) {
    const d = catchError(buildCtx.diagnostics, e);
    d.absFilePath = globalStylePath;
  }

  if (compilerCtx.cachedGlobalStyles) {
    compilerCtx.cachedGlobalStyles.delete(globalStylePath);
  }
  return null;
};

const canSkipGlobalStyle = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, globalStylePath: string) => {
  if (!compilerCtx.cachedGlobalStyles) {
    return false;
  }

  const cachedGlobalStyle = compilerCtx.cachedGlobalStyles.get(globalStylePath);
  if (!cachedGlobalStyle) {
    return false;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild && !buildCtx.hasStyleChanges) {
    return true;
  }

  if (buildCtx.filesChanged.includes(globalStylePath)) {
    // changed file IS the global entry style
    return false;
  }

  const hasChangedImports = await hasChangedImportFile(config, compilerCtx, buildCtx, globalStylePath, cachedGlobalStyle.code, []);
  if (hasChangedImports) {
    return false;
  }

  return true;
};

const hasChangedImportFile = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, content: string, noLoop: string[]): Promise<boolean> => {
  if (noLoop.includes(filePath)) {
    return false;
  }
  noLoop.push(filePath);

  return hasChangedImportContent(config, compilerCtx, buildCtx, filePath, content, noLoop);
};

const hasChangedImportContent = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, content: string, checkedFiles: string[]) => {
  const cssImports = await getCssImports(config, compilerCtx, buildCtx, filePath, content);
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
  const promises = cssImports.map(async cssImportData => {
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

import * as d from '../../declarations';
import { buildError, catchError, normalizePath, pathJoin } from '../util';
import { getGlobalStyleFilename } from '../app/app-file-naming';
import { minifyStyle } from './minify-style';
import { runPluginTransforms } from '../plugin/plugin';


export async function generateGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  if (canSkipGlobalStyles(config, buildCtx)) {
    return;
  }

  const timeSpan = buildCtx.createTimeSpan(`compile global style start`);

  try {
    const styleText = await loadGlobalStyle(config, compilerCtx, buildCtx, config.globalStyle);

    const fileName = getGlobalStyleFilename(config);

    const filePath = pathJoin(config, outputTarget.buildDir, fileName);
    buildCtx.debug(`global style: ${filePath}`);
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

    styleText = transformResults.code;

    if (config.minifyCss) {
      styleText = await minifyStyle(config, compilerCtx, buildCtx.diagnostics, styleText, filePath);
    }

  } catch (e) {
    const d = buildError(buildCtx.diagnostics);
    d.messageText = e + '';
    d.absFilePath = normalizePath(filePath);
    d.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, filePath));
  }

  return styleText;
}


function canSkipGlobalStyles(config: d.Config, buildCtx: d.BuildCtx) {
  if (typeof config.globalStyle !== 'string') {
    return true;
  }

  if (buildCtx.hasError || !buildCtx.isActiveBuild) {
    return true;
  }

  if (buildCtx.requiresFullBuild) {
    return false;
  }

  if (buildCtx.isRebuild && !buildCtx.hasStyleChanges) {
    return true;
  }

  return false;
}

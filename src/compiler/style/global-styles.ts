import * as d from '../../declarations';
import { buildError, catchError, normalizePath, pathJoin } from '../util';
import { getGlobalStyleFilename } from '../app/app-file-naming';
import { minifyStyle } from '../style/minify-style';
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
    config.logger.debug(`global style: ${filePath}`);
    await compilerCtx.fs.writeFile(filePath, styleText);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`compile global style finish`);
}


async function loadGlobalStyle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string) {
  let style = '';

  try {
    filePath = normalizePath(filePath);

    const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, filePath);

    style = transformResults.code;

    style = await minifyStyle(config, compilerCtx, buildCtx.diagnostics, style, filePath);

  } catch (e) {
    const d = buildError(buildCtx.diagnostics);
    d.messageText = `config.globalStyle ${e}`;
  }

  return style;
}


function canSkipGlobalStyles(config: d.Config, buildCtx: d.BuildCtx) {
  if (typeof config.globalStyle !== 'string') {
    return true;
  }

  if (buildCtx.shouldAbort()) {
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

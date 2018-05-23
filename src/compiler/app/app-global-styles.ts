import * as d from '../../declarations';
import { buildError, catchError, normalizePath, pathJoin } from '../util';
import { getGlobalStyleFilename } from './app-file-naming';
import { minifyStyle } from '../style/minify-style';
import { runPluginTransforms } from '../plugin/plugin';


export async function generateGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  if (typeof config.globalStyle !== 'string') {
    config.logger.debug(`"config.globalStyle" not found`);
    return;
  }

  const timeSpan = config.logger.createTimeSpan(`compile global style start`);

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

import { BuildCtx, CompilerCtx, Config } from '../../util/interfaces';
import { catchError, normalizePath, pathJoin } from '../util';
import { getGlobalStyleFilename } from './app-file-naming';
import { runPluginTransforms } from '../plugin/plugin';


export async function generateGlobalStyles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  const filePaths = config.globalStyle;
  if (!filePaths || !filePaths.length) {
    config.logger.debug(`"config.globalStyle" not found`);
    return;
  }

  const timeSpan = config.logger.createTimeSpan(`compile global style start`);

  try {
    const styles = await Promise.all(filePaths.map(async filePath => {
      filePath = normalizePath(filePath);

      const transformResults = await runPluginTransforms(config, compilerCtx, buildCtx, filePath);

      return transformResults.code;
    }));

    const styleText = styles.join('\n').trim();

    const fileName = getGlobalStyleFilename(config);

    if (config.outputTargets['www']) {
      const wwwFilePath = pathJoin(config, config.buildDir, fileName);
      config.logger.debug(`www global style: ${wwwFilePath}`);
      await compilerCtx.fs.writeFile(wwwFilePath, styleText);
    }

    if (config.outputTargets['distribution']) {
      const distFilePath = pathJoin(config, config.outputTargets['distribution'].dir, fileName);
      config.logger.debug(`dist global style: ${distFilePath}`);
      await compilerCtx.fs.writeFile(distFilePath, styleText);
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`compile global style finish`);
}

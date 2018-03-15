import * as d from '../../declarations';
import { catchError, normalizePath, pathJoin } from '../util';
import { getGlobalStyleFilename } from './app-file-naming';
import { runPluginTransforms } from '../plugin/plugin';


export async function generateGlobalStyles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
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

    const filePath = pathJoin(config, outputTarget.buildDir, fileName);
    config.logger.debug(`global style: ${filePath}`);
    await compilerCtx.fs.writeFile(filePath, styleText);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`compile global style finish`);
}

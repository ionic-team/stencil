import { BuildConfig } from '../../util/interfaces';
import { catchError, getBuildContext, hasError, resetBuildContext } from '../util';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { compileSrcDir } from '../build/compile';
import { genereateReadmes } from './readme';
import { generateHtmlDiagnostics } from '../../util/logger/generate-html-diagnostics';
import { getAppFileName } from '../app/app-file-naming';
import { isConfigValid } from '../build/build';


export function docs(config: BuildConfig) {
  const ctx = getBuildContext({});
  resetBuildContext(ctx);

  config.logger.info(config.logger.cyan(`${config.sys.compiler.name} v${config.sys.compiler.version}`));

  // validate the build config
  if (!isConfigValid(config, ctx, ctx.diagnostics)) {
    // invalid build config, let's not continue
    config.logger.printDiagnostics(ctx.diagnostics);
    generateHtmlDiagnostics(config, ctx.diagnostics);
    return Promise.resolve(null);
  }

  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`generate docs, ${getAppFileName(config)}, started`);

  // begin the build
  return Promise.resolve().then(() => {
    // async scan the src directory for ts files
    // then transpile them all in one go
    return compileSrcDir(config, ctx);

  }).then(() => {
    // generate each of the readmes
    return genereateReadmes(config, ctx);

  }).catch(err => {
    // catch all phase
    catchError(ctx.diagnostics, err);

  }).then(() => {
    // finalize phase
    ctx.diagnostics = cleanDiagnostics(ctx.diagnostics);
    config.logger.printDiagnostics(ctx.diagnostics);
    generateHtmlDiagnostics(config, ctx.diagnostics);

    // create a nice pretty message stating what happend
    let buildStatus = 'finished';
    let statusColor = 'green';

    if (hasError(ctx.diagnostics)) {
      buildStatus = 'failed';
      statusColor = 'red';
    }

    timeSpan.finish(`generate docs ${buildStatus}`, statusColor, true, true);

    return null;
  });
}

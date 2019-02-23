import * as d from '@declarations';
import { catchError, cleanDiagnostics, hasError } from '@utils';
import { BuildContext } from '../build/build-ctx';
import { logger, sys } from '@sys';
import { transpileApp } from '../transpile/transpile-app';
import { outputDocs } from '../output-targets/output-docs';


export async function docs(config: d.Config, compilerCtx: d.CompilerCtx) {
  const buildCtx = new BuildContext(config, compilerCtx);

  logger.info(logger.cyan(`${sys.compiler.name} v${sys.compiler.version}`));

  // keep track of how long the entire build process takes
  const timeSpan = logger.createTimeSpan(`generate docs, ${config.fsNamespace}, started`);

  try {
    // begin the build
    // async scan the src directory for ts files
    // then transpile them all in one go
    await transpileApp(config, compilerCtx, buildCtx);

    // generate each of the docs
    await outputDocs(config, compilerCtx, buildCtx);

  } catch (e) {
    // catch all phase
    catchError(buildCtx.diagnostics, e);
  }

  // finalize phase
  buildCtx.diagnostics = cleanDiagnostics(buildCtx.diagnostics);
  logger.printDiagnostics(buildCtx.diagnostics, config.rootDir);

  // create a nice pretty message stating what happend
  let buildStatus = 'finished';
  let statusColor = 'green';

  if (hasError(buildCtx.diagnostics)) {
    buildStatus = 'failed';
    statusColor = 'red';
  }

  timeSpan.finish(`generate docs ${buildStatus}`, statusColor, true, true);
}


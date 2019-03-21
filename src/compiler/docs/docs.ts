import * as d from '../../declarations';
import { catchError, cleanDiagnostics, hasError } from '@utils';
import { BuildContext } from '../build/build-ctx';
import { transpileApp } from '../transpile/transpile-app';
import { plugin as docsPlugin } from '../output-plugins/docs';
import { plugin as jsonDocsPlugin } from '../output-plugins/docs-json';
import { plugin as vscodeDocsPlugin } from '../output-plugins/docs-vscode'
import { createPluginOutput } from '../output-plugins/create-plugin-output';


export async function docs(config: d.Config, compilerCtx: d.CompilerCtx) {
  const buildCtx = new BuildContext(config, compilerCtx);

  config.logger.info(config.logger.cyan(`${config.sys.compiler.name} v${config.sys.compiler.version}`));

  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`generate docs, ${config.fsNamespace}, started`);

  try {
    // begin the build
    // async scan the src directory for ts files
    // then transpile them all in one go
    await transpileApp(config, compilerCtx, buildCtx);

    // generate each of the docs
    await createPluginOutput(config, compilerCtx, buildCtx, [docsPlugin, jsonDocsPlugin, vscodeDocsPlugin]);

  } catch (e) {
    // catch all phase
    catchError(buildCtx.diagnostics, e);
  }

  // finalize phase
  buildCtx.diagnostics = cleanDiagnostics(buildCtx.diagnostics);
  config.logger.printDiagnostics(buildCtx.diagnostics, config.rootDir);

  // create a nice pretty message stating what happend
  let buildStatus = 'finished';
  let statusColor = 'green';

  if (hasError(buildCtx.diagnostics)) {
    buildStatus = 'failed';
    statusColor = 'red';
  }

  timeSpan.finish(`generate docs ${buildStatus}`, statusColor, true, true);
}


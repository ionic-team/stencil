import { CompilerCtx, Config, OutputTargetDocs } from '../../declarations';
import { catchError, hasError } from '../util';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { generateJsons } from './json/generate-jsons';
import { generateReadmes } from './readme/generate-readmes';
import { getBuildContext } from '../build/build-utils';
import { getCompilerCtx } from '../build/compiler-ctx';
import { transpileAppModules } from '../transpile/transpile-app-modules';


export async function docs(config: Config, compilerCtx: CompilerCtx) {
  compilerCtx = getCompilerCtx(config, compilerCtx);
  const buildCtx = getBuildContext(config, compilerCtx, null);

  config.logger.info(config.logger.cyan(`${config.sys.compiler.name} v${config.sys.compiler.version}`));

  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`generate docs, ${config.fsNamespace}, started`);

  try {
    // begin the build
    // async scan the src directory for ts files
    // then transpile them all in one go
    await transpileAppModules(config, compilerCtx, buildCtx);

    // generate each of the docs
    await generateDocs(config, compilerCtx);

  } catch (e) {
    // catch all phase
    catchError(buildCtx.diagnostics, e);
  }

  // finalize phase
  buildCtx.diagnostics = cleanDiagnostics(buildCtx.diagnostics);
  config.logger.printDiagnostics(buildCtx.diagnostics);

  // create a nice pretty message stating what happend
  let buildStatus = 'finished';
  let statusColor = 'green';

  if (hasError(buildCtx.diagnostics)) {
    buildStatus = 'failed';
    statusColor = 'red';
  }

  timeSpan.finish(`generate docs ${buildStatus}`, statusColor, true, true);
}


export function generateDocs(config: Config, compilerCtx: CompilerCtx) {
  const docsOutputTargets: OutputTargetDocs[] = config.outputTargets.filter(o => o.type === 'docs');

  return Promise.all(docsOutputTargets.map(outputTarget => {
    return generateDocOutputTarget(config, compilerCtx, outputTarget);
  }));
}


async function generateDocOutputTarget(config: Config, compilerCtx: CompilerCtx, outputTarget: OutputTargetDocs) {
  if (outputTarget.format === 'readme') {
    return generateReadmes(config, compilerCtx);
  }

  if (outputTarget.format === 'json') {
    return generateJsons(config, compilerCtx);
  }

  throw new Error(`invalid docs format: ${outputTarget.format}`);
}

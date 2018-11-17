import * as d from '../../declarations';
import { BuildContext } from '../build/build-ctx';
import { catchError, hasError } from '../util';
import { cleanDiagnostics } from '../../util/logger/logger-util';
import { generateApiDocs } from './generate-api-docs';
import { generateDocData } from './generate-doc-data';
import { generateJsonDocs } from './generate-json-docs';
import { generateReadmeDocs } from './generate-readme-docs';
import { getCompilerCtx } from '../build/compiler-ctx';
import { strickCheckDocs } from './strict-check';
import { transpileApp } from '../transpile/transpile-app';


export async function docs(config: d.Config, compilerCtx: d.CompilerCtx) {
  compilerCtx = getCompilerCtx(config, compilerCtx);
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


export async function generateDocs(config: d.Config, compilerCtx: d.CompilerCtx) {
  const docsOutputTargets = config.outputTargets.filter(o => {
    return o.type === 'docs' || o.type === 'docs-json' || o.type === 'docs-api';
  });

  if (docsOutputTargets.length === 0) {
    return;
  }

  const docsData = await generateDocData(config, compilerCtx);

  const strictCheck = (docsOutputTargets as d.OutputTargetDocsReadme[]).some(o => !!o.strict);
  if (strictCheck) {
    strickCheckDocs(config, docsData);
  }

  const readmeTargets = (docsOutputTargets as d.OutputTargetDocsReadme[]).filter(o => o.type === 'docs');
  if (readmeTargets.length > 0) {
    await generateReadmeDocs(config, compilerCtx, readmeTargets, docsData);
  }

  const jsonTargets = (docsOutputTargets as d.OutputTargetDocsJson[]).filter(o => o.type === 'docs-json');
  if (jsonTargets.length > 0) {
    await generateJsonDocs(config, compilerCtx, jsonTargets, docsData);
  }

  const apiTargets = (docsOutputTargets as d.OutputTargetDocsApi[]).filter(o => o.type === 'docs-api');
  if (apiTargets.length > 0) {
    await generateApiDocs(compilerCtx, apiTargets, docsData);
  }
}

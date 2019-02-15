import { generateReadmeDocs } from './generate-readme-docs';
import * as d from '@declarations';
import { catchError, cleanDiagnostics, hasError } from '@utils';
import { generateDocData } from './generate-doc-data';
import { generateWebComponentsJson } from './generate-web-components-json';
import { generateJsonDocs } from './generate-json-docs';
import { BuildContext } from '../build/build-ctx';
import { generateCustomDocs } from './generate-custom-docs';
import { logger, sys } from '@sys';
import { strickCheckDocs } from './strict-check';
import { transpileApp } from '../transpile/transpile-app';
import { isOutputTargetDist, isOutputTargetDocs, isOutputTargetDocsCustom, isOutputTargetDocsJson } from '../output-targets/output-utils';


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
    await generateDocs(config, compilerCtx, buildCtx);

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


export async function generateDocs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.buildDocs) {
    return;
  }
  const distOutputTargets = config.outputTargets.filter(isOutputTargetDist);
  const docsOutputTargets = config.outputTargets.filter(o => {
    return o.type === 'docs' || o.type === 'docs-json' || o.type === 'docs-custom';
  });

  // ensure all the styles are built first, which parses all the css docs
  await buildCtx.stylesPromise;

  const docsData = await generateDocData(compilerCtx, buildCtx);

  // generate web-components.json
  await generateWebComponentsJson(compilerCtx, distOutputTargets, docsData);

  // generate READMEs docs
  const readmeTargets = docsOutputTargets.filter(isOutputTargetDocs);
  const strictCheck = readmeTargets.some(o => !!o.strict);
  if (strictCheck) {
    strickCheckDocs(docsData);
  }

  if (readmeTargets.length > 0) {
    await generateReadmeDocs(config, compilerCtx, readmeTargets, docsData);
  }

  // generate json docs
  const jsonTargets = docsOutputTargets.filter(isOutputTargetDocsJson);
  if (jsonTargets.length > 0) {
    await generateJsonDocs(compilerCtx, jsonTargets, docsData);
  }

  // generate custom docs
  const customTargets = docsOutputTargets.filter(isOutputTargetDocsCustom);
  if (customTargets.length > 0) {
    await generateCustomDocs(customTargets, docsData);
  }
}

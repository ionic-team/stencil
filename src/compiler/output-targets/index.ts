import * as d from '@declarations';
import { outputDocs } from './output-docs';
import { generateServiceWorkers } from '../service-worker/generate-sw';
import { outputAngularProxies } from './output-angular';
import { outputApp } from './output-app';
import { outputCollections } from './output-collection';
import { outputCommonJsIndexes } from './output-commonjs';
import { outputEsmIndexes } from './output-esm';
import { outputHydrate } from './output-hydrate';
import { outputIndexHtmls } from './output-index-html';
import { outputModule } from './output-module';
// import { outputSelfContainedWebComponents } from './output-self-contained-web-components';


export async function generateOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate app files started`);

  const generateOutputs = [
    outputCollections(config, compilerCtx, buildCtx),
    outputAngularProxies(config, compilerCtx, buildCtx),
    outputModulesApp(config, compilerCtx, buildCtx),
    outputCommonJsIndexes(config, compilerCtx, buildCtx),
    outputDocs(config, compilerCtx, buildCtx),
    generateServiceWorkers(config, compilerCtx, buildCtx),
    outputEsmIndexes(config, compilerCtx, buildCtx),
    outputHydrate(config, compilerCtx, buildCtx),
    outputIndexHtmls(config, compilerCtx, buildCtx),
    // outputSelfContainedWebComponents(config, compilerCtx, buildCtx),
    buildCtx.stylesPromise
  ];

  await Promise.all(generateOutputs);

  timespan.finish(`generate app files finished`);
}

async function outputModulesApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  await outputModule(config, compilerCtx, buildCtx);
  return outputApp(config, compilerCtx, buildCtx, 'webComponentsModule');
}

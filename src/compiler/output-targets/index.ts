import * as d from '../../declarations';
import { outputDocs } from './output-docs';
import { generateServiceWorkers } from '../service-worker/generate-sw';
import { outputAngularProxies } from './output-angular';
import { outputApp } from './output-app';
import { outputCollections } from './output-collection';
import { outputHydrate } from './output-hydrate';
import { outputWww } from './output-www';
import { outputModule } from './output-module';


export async function generateOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
    return;
  }

  const generateOutputs = [
    outputCollections(config, compilerCtx, buildCtx),
    outputAngularProxies(config, compilerCtx, buildCtx),
    outputModulesApp(config, compilerCtx, buildCtx),
    outputDocs(config, compilerCtx, buildCtx),
    generateServiceWorkers(config, compilerCtx, buildCtx),
    outputHydrate(config, compilerCtx, buildCtx),
    // outputSelfContainedWebComponents(config, compilerCtx, buildCtx),
    buildCtx.stylesPromise
  ];

  await Promise.all(generateOutputs);
}

async function outputModulesApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  await outputModule(config, compilerCtx, buildCtx);
  await outputApp(config, compilerCtx, buildCtx, 'webComponentsModule');
  await outputWww(config, compilerCtx, buildCtx);
}

import * as d from '../../declarations';
import { generateServiceWorkers } from '../service-worker/generate-sw';
import { outputApp } from './output-app';
import { outputCollections } from './output-collection';
import { outputHydrate } from './output-hydrate';
import { outputWww } from './output-www';
import { outputModule } from './output-module';
import { createPluginOutput } from '../output-plugins/create-plugin-output';


export async function generateOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort) {
    return;
  }

  const generateOutputs = [
    outputCollections(config, compilerCtx, buildCtx),
    outputModulesApp(config, compilerCtx, buildCtx),
    generateServiceWorkers(config, compilerCtx, buildCtx),
    outputHydrate(config, compilerCtx, buildCtx),
    createPluginOutput(config, compilerCtx, buildCtx),
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

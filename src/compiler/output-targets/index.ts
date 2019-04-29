import * as d from '../../declarations';
import { outputApp } from './output-app';
import { outputCollections } from './output-collection';
import { outputHydrate } from './output-hydrate';
import { outputModule } from './output-module';
import { outputTypes } from './output-types';
import { outputWww } from './output-www';
import { createPluginOutput } from '../output-plugins/create-plugin-output';
import { canSkipAppCoreBuild } from './output-utils';


export async function generateOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (canSkipAppCoreBuild(buildCtx)) {
    return;
  }

  const generateOutputs = [
    outputCollections(config, compilerCtx, buildCtx),
    outputModulesApp(config, compilerCtx, buildCtx),
    outputHydrate(config, compilerCtx, buildCtx),
    createPluginOutput(config, compilerCtx, buildCtx),
    // outputSelfContainedWebComponents(config, compilerCtx, buildCtx),
    buildCtx.stylesPromise
  ];

  await Promise.all(generateOutputs);

  // must run after all the other outputs
  // since it validates files were created
  await outputTypes(config, compilerCtx, buildCtx);
}

async function outputModulesApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  await outputModule(config, compilerCtx, buildCtx);
  const bundleModules = await outputApp(config, compilerCtx, buildCtx, 'webComponentsModule');

  if (bundleModules != null) {
    await outputWww(config, compilerCtx, buildCtx, bundleModules);
  }
}

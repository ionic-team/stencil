import * as d from '../../declarations';
import { catchError } from '../util';
import { createAppRegistry, writeAppRegistry } from './app-registry';
import { generateAppGlobalScript } from './app-global-scripts';
import { generateCore } from './app-core';
import { generateEs5DisabledMessage } from './app-es5-disabled';
import { generateGlobalStyles } from './app-global-styles';
import { generateLoader } from './app-loader';
import { setBuildConditionals } from './build-conditionals';
import { generateCustomElements } from './generate-custom-elements';


export function generateAppFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry) {
  const outputTargets = config.outputTargets.filter(outputTarget => {
    return outputTarget.appBuild;
  });

  return Promise.all(outputTargets.map(outputTarget => {
    return generateAppFilesOutputTarget(config, compilerCtx, buildCtx, outputTarget, entryModules, cmpRegistry);
  }));
}


export async function generateAppFilesOutputTarget(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, entryModules: d.EntryModule[], cmpRegistry: d.ComponentRegistry) {
  if (!config.buildAppCore) {
    config.logger.createTimeSpan(`generate app files skipped`, true);
    return;
  }

  const timespan = config.logger.createTimeSpan(`generate app files started`);

  try {
    // generate the shared app registry object
    const appRegistry = createAppRegistry(config);

    await Promise.all([
      // core esm build
      generateCoreEsm(config, compilerCtx, buildCtx, outputTarget, entryModules, appRegistry),

      // core es5 build
      generateCoreEs5(config, compilerCtx, buildCtx, outputTarget, entryModules, appRegistry)
    ]);

    await Promise.all([
      // create a json file for the app registry
      writeAppRegistry(config, compilerCtx, outputTarget, appRegistry, cmpRegistry),

      // create the loader(s) after creating the loader file name
      generateLoader(config, compilerCtx, outputTarget, appRegistry, cmpRegistry),

      // create the global styles
      generateGlobalStyles(config, compilerCtx, buildCtx, outputTarget),

      // create the custom elements
      generateCustomElements(config, compilerCtx, cmpRegistry, entryModules)
    ]);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate app files finished`);
}


async function generateCoreEsm(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, entryModules: d.EntryModule[], appRegistry: d.AppRegistry) {
  // esm core build
  const globalJsContentsEsm = await generateAppGlobalScript(config, compilerCtx, buildCtx, appRegistry);

  // figure out which sections should be included in the core build
  const buildConditionals = await setBuildConditionals(config, compilerCtx, 'core', buildCtx, entryModules);

  const coreFilename = await generateCore(config, compilerCtx, buildCtx, outputTarget, globalJsContentsEsm, buildConditionals);
  appRegistry.core = coreFilename;
}


async function generateCoreEs5(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTarget, entryModules: d.EntryModule[], appRegistry: d.AppRegistry) {
  if (config.buildEs5) {
    // core es5 build
    const globalJsContentsEs5 = await generateAppGlobalScript(config, compilerCtx, buildCtx, appRegistry, 'es5');

    const buildConditionalsEs5 = await setBuildConditionals(config, compilerCtx, 'core.pf', buildCtx, entryModules);

    const coreFilenameEs5 = await generateCore(config, compilerCtx, buildCtx, outputTarget, globalJsContentsEs5, buildConditionalsEs5);
    appRegistry.corePolyfilled = coreFilenameEs5;

  } else {
    // not doing an es5, probably in dev mode
    appRegistry.corePolyfilled = await generateEs5DisabledMessage(config, compilerCtx, outputTarget);
  }
}

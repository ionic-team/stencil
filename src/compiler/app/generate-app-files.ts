import { BuildCtx, CompilerCtx, ComponentRegistry, Config, EntryModule, OutputTarget } from '../../declarations';
import { catchError } from '../util';
import { createAppRegistry, writeAppRegistry } from './app-registry';
import { generateAppGlobalScript } from './app-global-scripts';
import { generateCore } from './app-core';
import { generateEs5DisabledMessage } from './app-es5-disabled';
import { generateGlobalStyles } from './app-global-styles';
import { generateLoader } from './app-loader';
import { setBuildConditionals } from './build-conditionals';


export function generateAppFiles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[], cmpRegistry: ComponentRegistry) {
  return Promise.all(config.outputTargets.map(outputTarget => {
    return generateAppFilesOutputTarget(config, compilerCtx, buildCtx, outputTarget, entryModules, cmpRegistry);
  }));
}


export async function generateAppFilesOutputTarget(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget, entryModules: EntryModule[], cmpRegistry: ComponentRegistry) {
  if (!config.buildAppCore) {
    config.logger.createTimeSpan(`generate app files skipped`, true);
    return;
  }

  const timespan = config.logger.createTimeSpan(`generate app files started`);

  try {
    // generate the shared app registry object
    const appRegistry = createAppRegistry(config);

    // normal es2015 build
    const globalJsContentsEs2015 = await generateAppGlobalScript(config, compilerCtx, buildCtx, outputTarget, appRegistry);

    // figure out which sections should be included in the core build
    const buildConditionals = await setBuildConditionals(config, compilerCtx, buildCtx, entryModules);
    buildConditionals.coreId = 'core';

    const coreFilename = await generateCore(config, compilerCtx, buildCtx, outputTarget, globalJsContentsEs2015, buildConditionals);
    appRegistry.core = coreFilename;

    if (config.buildEs5) {
      // es5 build (if needed)
      const globalJsContentsEs5 = await generateAppGlobalScript(config, compilerCtx, buildCtx, outputTarget, appRegistry, 'es5');

      const buildConditionalsEs5 = await setBuildConditionals(config, compilerCtx, buildCtx, entryModules);
      buildConditionalsEs5.coreId = 'core.pf';
      buildConditionalsEs5.es5 = true;
      buildConditionalsEs5.polyfills = true;
      buildConditionalsEs5.cssVarShim = true;

      const coreFilenameEs5 = await generateCore(config, compilerCtx, buildCtx, outputTarget, globalJsContentsEs5, buildConditionalsEs5);
      appRegistry.corePolyfilled = coreFilenameEs5;

    } else {
      // not doing an es5, probably in dev mode
      appRegistry.corePolyfilled = await generateEs5DisabledMessage(config, compilerCtx, outputTarget);
    }

    // create a json file for the app registry
    await writeAppRegistry(config, compilerCtx, outputTarget, appRegistry, cmpRegistry);

    // create the loader(s) after creating the loader file name
    await generateLoader(config, compilerCtx, outputTarget, appRegistry, cmpRegistry);

    // create the global styles
    await generateGlobalStyles(config, compilerCtx, buildCtx, outputTarget);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate app files finished`);
}

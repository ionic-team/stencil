import { BuildCtx, Bundle, CompilerCtx, ComponentRegistry, Config } from '../../util/interfaces';
import { catchError, pathJoin } from '../util';
import { createAppRegistry, writeAppRegistry } from './app-registry';
import { generateAppGlobalScript } from './app-global-scripts';
import { generateCore } from './app-core';
import { generateEs5DisabledMessage } from './app-es5-disabled';
import { generateGlobalStyles } from './app-global-styles';
import { generateLoader } from './app-loader';
import { getAppWWWBuildDir } from './app-file-naming';
import { setBuildConditionals } from './build-conditionals';


export async function generateAppFiles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundles: Bundle[], cmpRegistry: ComponentRegistry) {
  if (!config.buildAppCore) {
    config.logger.createTimeSpan(`generate app files skipped`, true);
    return;
  }

  const timespan = config.logger.createTimeSpan(`generate app files started`);

  try {
    // generate the shared app registry object
    const appRegistry = createAppRegistry(config);

    // normal es2015 build
    const globalJsContentsEs2015 = await generateAppGlobalScript(config, compilerCtx, buildCtx, appRegistry);

    // figure out which sections should be included in the core build
    const buildConditionals = await setBuildConditionals(config, compilerCtx, bundles);
    buildConditionals.coreId = 'core';

    const coreFilename = await generateCore(config, compilerCtx, buildCtx, globalJsContentsEs2015, buildConditionals);
    appRegistry.core = coreFilename;
    compilerCtx.appCoreWWWPath = pathJoin(config, getAppWWWBuildDir(config), coreFilename);

    if (config.buildEs5) {
      // es5 build (if needed)
      const globalJsContentsEs5 = await generateAppGlobalScript(config, compilerCtx, buildCtx, appRegistry, 'es5');

      const buildConditionalsEs5 = await setBuildConditionals(config, compilerCtx, bundles);
      buildConditionalsEs5.coreId = 'core.pf';
      buildConditionalsEs5.es5 = true;
      buildConditionalsEs5.polyfills = true;
      buildConditionalsEs5.cssVarShim = true;

      const coreFilenameEs5 = await generateCore(config, compilerCtx, buildCtx, globalJsContentsEs5, buildConditionalsEs5);
      appRegistry.corePolyfilled = coreFilenameEs5;

    } else if (config.generateWWW) {
      // not doing an es5, probably in dev mode
      // and don't bother if we're not generating a www build
      appRegistry.corePolyfilled = await generateEs5DisabledMessage(config, compilerCtx);
    }

    // create a json file for the app registry
    writeAppRegistry(config, compilerCtx, appRegistry, cmpRegistry);

    // create the loader after creating the loader file name
    await generateLoader(config, compilerCtx, appRegistry, cmpRegistry);

    // create the global styles
    await generateGlobalStyles(config, compilerCtx, buildCtx);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  timespan.finish(`generate app files finished`);
}

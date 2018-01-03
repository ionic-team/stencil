import { BuildConfig, BuildContext, ComponentRegistry, Bundle } from '../../util/interfaces';
import { createAppRegistry, writeAppRegistry } from './app-registry';
import { generateAppGlobalScript } from './app-global-scripts';
import { generateCore } from './app-core';
import { generateEs5DisabledMessage } from './app-es5-disabled';
import { generateGlobalStyles } from './app-global-styles';
import { generateLoader } from './app-loader';
import { getAppWWWBuildDir } from './app-file-naming';
import { hasError, pathJoin } from '../util';
import { setBuildConditionals } from './build-conditionals';


export async function generateAppFiles(config: BuildConfig, ctx: BuildContext, bundles: Bundle[], cmpRegistry: ComponentRegistry) {
  if (hasError(ctx.diagnostics)) {
    return;
  }

  const timespan = config.logger.createTimeSpan(`generateAppFiles: ${config.namespace} start`, true);

  // generate the shared app registry object
  const appRegistry = createAppRegistry(config, cmpRegistry);

  // normal es2015 build
  const globalJsContentsEs2015 = await generateAppGlobalScript(config, ctx, appRegistry);

  // figure out which sections should be included in the core build
  const buildConditionals = setBuildConditionals(ctx, bundles);
  buildConditionals.coreId = 'core';
  buildConditionals.ssrClientSide = false;

  const coreFilename = await generateCore(config, ctx, globalJsContentsEs2015, buildConditionals);
  appRegistry.core = coreFilename;

  const buildConditionalsSsr = setBuildConditionals(ctx, bundles);
  buildConditionalsSsr.coreId = 'core.ssr';
  buildConditionalsSsr.ssrClientSide = true;

  const coreSsrFilename = await generateCore(config, ctx, globalJsContentsEs2015, buildConditionalsSsr);
  appRegistry.coreSsr = coreSsrFilename;
  ctx.appCoreWWWPath = pathJoin(config, getAppWWWBuildDir(config), coreSsrFilename);


  if (config.buildEs5) {
    // es5 build (if needed)
    const globalJsContentsEs5 = await generateAppGlobalScript(config, ctx, appRegistry, 'es5');

    const buildConditionalsEs5 = setBuildConditionals(ctx, bundles);
    buildConditionalsEs5.coreId = 'core.pf';
    buildConditionalsEs5.es5 = true;
    buildConditionalsEs5.polyfills = true;
    buildConditionalsEs5.cssVarShim = true;
    buildConditionalsEs5.ssrClientSide = true;

    const coreFilenameEs5 = await generateCore(config, ctx, globalJsContentsEs5, buildConditionalsEs5);
    appRegistry.corePolyfilled = coreFilenameEs5;

  } else if (config.generateWWW) {
    // not doing an es5, probably in dev mode
    // and don't bother if we're not generating a www build
    appRegistry.corePolyfilled = generateEs5DisabledMessage(config, ctx);
  }

  // create a json file for the app registry
  writeAppRegistry(config, ctx, appRegistry);

  // create the loader after creating the loader file name
  await generateLoader(config, ctx, appRegistry, cmpRegistry);

  // create the global styles
  await generateGlobalStyles(config, ctx);

  timespan.finish(`generateAppFiles: ${config.namespace} finished`);
}

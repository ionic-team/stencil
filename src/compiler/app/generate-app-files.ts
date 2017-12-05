import { AppRegistry, BuildConfig, BuildContext } from '../../util/interfaces';
import { formatComponentRegistry } from '../../util/data-serialize';
import { generateCore } from './app-core';
import { generateAppGlobal } from './app-global';
import { generateAppRegistry } from './app-registry';
import { generateEs5DisabledMessage } from './app-es5-disabled';
import { generateLoader } from './app-loader';
import { hasError } from '../util';
import { setBuildConditionals } from './build-conditionals';


export async function generateAppFiles(config: BuildConfig, ctx: BuildContext) {
  if (hasError(ctx.diagnostics)) {
    return Promise.resolve();
  }

  const timespan = config.logger.createTimeSpan(`generateAppFiles: ${config.namespace} start`, true);

  // generate the shared app registry object
  const appRegistry: AppRegistry = {
    namespace: config.namespace,
    components: formatComponentRegistry(ctx.registry)
  };

  // normal es2015 build
  const globalJsContentsEs2015 = await generateAppGlobal(config, ctx, 'es2015', appRegistry);

  // figure out which sections should be included in the core build
  const buildConditionals = setBuildConditionals(ctx, ctx.manifestBundles);
  buildConditionals.coreId = 'core';
  buildConditionals.ssrClientSide = false;

  const coreFilename = await generateCore(config, ctx, 'es2015', globalJsContentsEs2015, buildConditionals);
  appRegistry.core = coreFilename;


  const buildConditionalsSsr = setBuildConditionals(ctx, ctx.manifestBundles);
  buildConditionalsSsr.coreId = 'core.ssr';
  buildConditionalsSsr.ssrClientSide = true;

  const coreSsrFilename = await generateCore(config, ctx, 'es2015', globalJsContentsEs2015, buildConditionalsSsr);
  appRegistry.coreSsr = coreSsrFilename;


  if (config.es5Fallback) {
    // es5 build (if needed)
    const globalJsContentsEs5 = await generateAppGlobal(config, ctx, 'es5', appRegistry);

    const buildConditionalsEs5 = setBuildConditionals(ctx, ctx.manifestBundles);
    buildConditionalsEs5.coreId = 'core.pf';
    buildConditionalsEs5.es5 = true;
    buildConditionalsEs5.polyfills = true;
    buildConditionalsEs5.cssVarShim = true;
    buildConditionalsEs5.ssrClientSide = true;

    const coreFilenameEs5 = await generateCore(config, ctx, 'es5', globalJsContentsEs5, buildConditionalsEs5);
    appRegistry.corePolyfilled = coreFilenameEs5;

  } else if (config.generateWWW) {
    // not doing an es5, probably in dev mode
    // and don't bother if we're not generating a www build
    appRegistry.corePolyfilled = generateEs5DisabledMessage(config, ctx);
  }

  // create a json file for the app registry
  await generateAppRegistry(config, ctx, appRegistry);

  // create the loader after creating the loader file name
  await generateLoader(config, ctx, appRegistry);

  timespan.finish(`generateAppFiles: ${config.namespace} finished`);
}

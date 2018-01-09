import { BuildConfig, BuildContext, HydrateOptions, HydrateResults } from '../util/interfaces';
import { catchError, getBuildContext } from '../compiler/util';
import { getGlobalWWW } from '../compiler/app/app-file-naming';
import { hydrateHtml } from './hydrate-html';
import { loadComponentRegistry } from './load-registry';
import { validateBuildConfig } from '../util/validate-config';


export function createRenderer(config: BuildConfig, ctx?: BuildContext) {
  validateBuildConfig(config);

  // load the component registry from the registry.json file
  const cmpRegistry = loadComponentRegistry(config);

  if (Object.keys(cmpRegistry).length === 0) {
    throw new Error(`No registered components found: ${config.namespace}`);
  }

  ctx = ctx || {};

  // init the buid context
  getBuildContext(ctx);

  // load the app global file into the context
  loadAppGlobal(config, ctx);

  // overload with two options for hydrateToString
  // one that returns a promise, and one that takes a callback as the last arg
  async function hydrateToString(hydrateOpts: HydrateOptions) {
    let hydrateResults: HydrateResults;

    // kick off hydrated, which is an async opertion
    try {
      hydrateResults = await hydrateHtml(config, ctx, cmpRegistry, hydrateOpts);

    } catch (e) {
      hydrateResults = {
        url: hydrateOpts.path,
        diagnostics: [],
        html: hydrateOpts.html,
        styles: null,
        anchors: [],
        components: [],
        styleUrls: [],
        scriptUrls: [],
        imgUrls: []
      };

      catchError(hydrateResults.diagnostics, e);
    }

    return hydrateResults;
  }

  return {
    hydrateToString: hydrateToString
  };
}


function loadAppGlobal(config: BuildConfig, ctx: BuildContext) {
  ctx.appFiles = ctx.appFiles || {};

  if (ctx.appFiles.global) {
    // already loaded the global js content
    return;
  }

  // let's load the app global js content
  const appGlobalPath = getGlobalWWW(config);
  try {
    ctx.appFiles.global = config.sys.fs.readFileSync(appGlobalPath, 'utf-8');

  } catch (e) {
    config.logger.debug(`missing app global: ${appGlobalPath}`);
  }
}

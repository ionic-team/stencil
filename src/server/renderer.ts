import { BuildConfig, BuildContext, ComponentRegistry, HydrateOptions, HydrateResults, LoadComponentRegistry } from '../util/interfaces';
import { buildError, getBuildContext } from '../compiler/util';
import { DEFAULT_PRERENDER_CONFIG } from '../compiler/prerender/validate-prerender-config';
import { getRegistryJsonWWW, getGlobalWWW } from '../compiler/app/generate-app-files';
import { hydrateHtml } from './hydrate-html';
import { parseComponentLoaders } from '../util/data-parse';
import { validateBuildConfig } from '../util/validate-config';


export function createRenderer(config: BuildConfig, registry?: ComponentRegistry, ctx?: BuildContext) {
  validateBuildConfig(config);

  ctx = ctx || {};

  // init the buid context
  getBuildContext(ctx);

  // load the app global file into the context
  loadAppGlobal(config, ctx);

  if (!registry) {
    // figure out the component registry
    // if one wasn't passed in already
    registry = registerComponents(config);
  }

  // overload with two options for hydrateToString
  // one that returns a promise, and one that takes a callback as the last arg
  function hydrateToString(hydrateOpts: HydrateOptions): Promise<HydrateResults> {

    // validate the hydrate options and add any missing info
    normalizeHydrateOptions(config, hydrateOpts);

    // kick off hydrated, which is an async opertion
    return hydrateHtml(config, ctx, registry, hydrateOpts).catch(err => {
      const hydrateResults: HydrateResults = {
        diagnostics: [buildError(err)],
        html: hydrateOpts.html,
        styles: null,
        anchors: []
      };
      return hydrateResults;
    });
  }

  return {
    hydrateToString: hydrateToString
  };
}


function registerComponents(config: BuildConfig) {
  let registry: ComponentRegistry = null;

  try {
    const registryJsonFilePath = getRegistryJsonWWW(config);

    // open up the registry json file
    const cmpRegistryJson = config.sys.fs.readFileSync(registryJsonFilePath, 'utf-8');

    // parse the json into js object
    const registryData = JSON.parse(cmpRegistryJson);

    // object should have the components property on it
    const components: LoadComponentRegistry[] = registryData.components;

    if (Array.isArray(components) && components.length > 0) {
      // i think we're good, let's create a registry
      // object to fill up with component data
      registry = {};

      // each component should be a LoadComponentRegistry interface
      components.forEach(cmpRegistryData => {
        // parse the LoadComponentRegistry data and
        // move it to the ComponentRegistry data
        parseComponentLoaders(cmpRegistryData, registry);
      });

    } else {
      throw new Error(`No components were found within the registry data`);
    }

  } catch (e) {
    throw new Error(`Unable to open component registry: ${e}`);
  }

  return registry;
}


function normalizeHydrateOptions(config: BuildConfig, opts: HydrateOptions) {
  const req = opts.req;

  if (req && typeof req.get === 'function') {
    // assuming node express request object
    // https://expressjs.com/
    if (!opts.url) opts.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (!opts.referrer) opts.referrer = req.get('referrer');
    if (!opts.userAgent) opts.userAgent = req.get('user-agent');
    if (!opts.cookie) opts.cookie = req.get('cookie');
  }

  if (!opts.url) {
    opts.url = '/';
  }

  const urlObj = config.sys.url.parse(opts.url);
  if (!urlObj.protocol) urlObj.protocol = 'https:';
  if (!urlObj.hostname) urlObj.hostname = DEFAULT_PRERENDER_CONFIG.host;

  opts.url = config.sys.url.format(urlObj);
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

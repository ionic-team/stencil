import { BuildConfig, BuildContext, HydrateOptions, HydrateResults } from '../util/interfaces';
import { buildError, getBuildContext } from '../compiler/util';
import { DEFAULT_PRERENDER_CONFIG, DEFAULT_SSR_CONFIG } from '../compiler/prerender/validate-prerender-config';
import { getGlobalWWW, getRegistryJsonWWW } from '../compiler/app/app-file-naming';
import { hydrateHtml } from './hydrate-html';
import { parseComponentRegistryJsonFile } from '../compiler/app/app-registry';
import { validateBuildConfig } from '../util/validate-config';


export function createRenderer(config: BuildConfig, ctx?: BuildContext) {
  validateBuildConfig(config);

  ctx = ctx || {};

  // init the buid context
  getBuildContext(ctx);

  // load the app global file into the context
  loadAppGlobal(config, ctx);

  if (!ctx.cmpRegistry) {
    // load the app registry if we haven't already
    // if one wasn't passed in already
    // and cache this for later reuse
    ctx.cmpRegistry = loadComponentRegistry(config);
  }

  // overload with two options for hydrateToString
  // one that returns a promise, and one that takes a callback as the last arg
  function hydrateToString(hydrateOpts: HydrateOptions): Promise<HydrateResults> {

    // validate the hydrate options and add any missing info
    hydrateOpts = normalizeHydrateOptions(config, hydrateOpts);

    // kick off hydrated, which is an async opertion
    return hydrateHtml(config, ctx, ctx.cmpRegistry, hydrateOpts).catch(err => {
      const hydrateResults: HydrateResults = {
        diagnostics: [buildError(err)],
        html: hydrateOpts.html,
        styles: null,
        anchors: [],
        components: [],
        styleUrls: [],
        scriptUrls: [],
        imgUrls: []
      };
      return hydrateResults;
    });
  }

  return {
    hydrateToString: hydrateToString
  };
}


function normalizeHydrateOptions(config: BuildConfig, inputOpts: HydrateOptions) {
  const opts = Object.assign({}, DEFAULT_SSR_CONFIG, inputOpts);
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

  return opts;
}


function loadComponentRegistry(config: BuildConfig) {
  const registryJsonFilePath = getRegistryJsonWWW(config);
  return parseComponentRegistryJsonFile(config, registryJsonFilePath);
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

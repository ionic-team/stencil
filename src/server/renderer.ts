import { BuildConfig, BuildContext, ComponentRegistry, HydrateOptions,
  HydrateResults, LoadComponentRegistry } from '../util/interfaces';
import { DEFAULT_PRERENDER_CONFIG } from '../compiler/prerender/validate-prerender-config';
import { getBuildContext } from '../compiler/util';
import { getRegistryJsonFilePath } from '../compiler/app/generate-app-files';
import { hydrateHtml } from './hydrate-html';
import { parseComponentRegistry } from '../util/data-parse';
import { validateBuildConfig } from '../compiler/build/validation';


export function createRenderer(config: BuildConfig, registry?: ComponentRegistry, ctx?: BuildContext) {
  // setup the config and add defaults for missing properties
  validateRendererConfig(config);

  if (!registry) {
    // figure out the component registry
    // if one wasn't passed in already
    registry = registerComponents(config);
  }

  // create the build context if it doesn't exist
  ctx = getBuildContext(ctx);

  // overload with two options for hydrateToString
  // one that returns a promise, and one that takes a callback as the last arg
  function hydrateToString(hydrateOpts: HydrateOptions): Promise<HydrateResults>;
  function hydrateToString(hydrateOpts: HydrateOptions, callback: (hydrateResults: HydrateResults) => void): void;
  function hydrateToString(opts: HydrateOptions, callback?: (hydrateResults: HydrateResults) => void): any {

    const hydrateResults: HydrateResults = {
      diagnostics: [],
      html: opts.html,
      styles: null,
      anchors: []
    };

    // only create a promise if the last argument
    // is not a callback function
    // always resolve cuz any errors are in the diagnostics
    let promise: Promise<any>;
    if (typeof callback !== 'function') {
      promise = new Promise(resolve => {
        callback = resolve;
      });
    }

    try {
      // validate the hydrate options and add any missing info
      validateHydrateOptions(config, opts);
      hydrateResults.url = opts.url;

      // kick off hydrated, which is an async opertion
      hydrateHtml(config, ctx, registry, opts, hydrateResults, callback);

    } catch (e) {
      hydrateResults.diagnostics.push({
        type: 'hydrate',
        level: 'error',
        header: 'Hydrate HTML',
        messageText: e
      });
      callback(hydrateResults);
    }

    // the promise will be undefined if a callback
    // was passed in as the last argument to hydrateToString()
    return promise;
  }

  return {
    hydrateToString: hydrateToString
  };
}


function registerComponents(config: BuildConfig) {
  let registry: ComponentRegistry = null;

  try {
    const registryJsonFilePath = getRegistryJsonFilePath(config);

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
        parseComponentRegistry(cmpRegistryData, registry);
      });

    } else {
      throw new Error(`No components were found within the registry data`);
    }

  } catch (e) {
    throw new Error(`Unable to open component registry: ${e}`);
  }

  return registry;
}


function validateHydrateOptions(config: BuildConfig, opts: HydrateOptions) {
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


function validateRendererConfig(config: BuildConfig) {
  if (!config.sys && require) {
    // assuming we're in a node environment,
    // if the config was not provided then use the
    // defaul stencil sys found in bin
    const path = require('path');
    config.sys = require(path.join(__dirname, '../../bin/sys'));
  }

  if (!config.logger && require) {
    // assuming we're in a node environment,
    // if a logger was not provided then use the
    // defaul stencil command line logger found in bin
    const path = require('path');
    const logger = require(path.join(__dirname, '../../bin/util')).logger;
    config.logger = new logger.CommandLineLogger({
      level: config.logLevel,
      process: process,
      chalk: require('chalk')
    });
  }

  validateBuildConfig(config);
}

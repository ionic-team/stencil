import { Config, ConfigBundle, Diagnostic, UnvalidatedConfig } from '../../declarations';
import { buildError, isBoolean, isNumber, isString, sortBy } from '@utils';
import { setBooleanConfig } from './config-utils';
import { validateDevServer } from './validate-dev-server';
import { validateDistNamespace } from './validate-namespace';
import { validateHydrated } from './validate-hydrated';
import { validateNamespace } from './validate-namespace';
import { validateOutputTargets } from './outputs';
import { validatePaths } from './validate-paths';
import { validatePlugins } from './validate-plugins';
import { validateRollupConfig } from './validate-rollup-config';
import { validateTesting } from './validate-testing';
import { validateWorkers } from './validate-workers';

/**
 * Validate a Config object, ensuring that all its field are present and
 * consistent with our expectations. This function transforms an
 * `UnvalidatedConfig` to a `Config`.
 *
 * @param userConfig an unvalidated config that we've gotten from a user
 * @returns an object with config and diagnostics props
 */
export const validateConfig = (
  userConfig: UnvalidatedConfig = {}
): {
  config: Config;
  diagnostics: Diagnostic[];
} => {
  const config = Object.assign({}, userConfig || {}); // not positive it's json safe
  const diagnostics: Diagnostic[] = [];

  // copy flags (we know it'll be json safe)
  config.flags = JSON.parse(JSON.stringify(config.flags || {}));

  // default devMode false
  if (config.flags.prod) {
    config.devMode = false;
  } else if (config.flags.dev) {
    config.devMode = true;
  } else if (!isBoolean(config.devMode)) {
    config.devMode = DEFAULT_DEV_MODE;
  }

  config.extras = config.extras || {};
  config.extras.appendChildSlotFix = !!config.extras.appendChildSlotFix;
  config.extras.cloneNodeFix = !!config.extras.cloneNodeFix;
  config.extras.cssVarsShim = !!config.extras.cssVarsShim;
  config.extras.dynamicImportShim = !!config.extras.dynamicImportShim;
  config.extras.lifecycleDOMEvents = !!config.extras.lifecycleDOMEvents;
  config.extras.safari10 = !!config.extras.safari10;
  config.extras.scriptDataOpts = !!config.extras.scriptDataOpts;
  config.extras.shadowDomShim = !!config.extras.shadowDomShim;
  config.extras.slotChildNodesFix = !!config.extras.slotChildNodesFix;
  config.extras.initializeNextTick = !!config.extras.initializeNextTick;
  config.extras.tagNameTransform = !!config.extras.tagNameTransform;

  config.buildEs5 = config.buildEs5 === true || (!config.devMode && config.buildEs5 === 'prod');

  setBooleanConfig(config, 'minifyCss', null, !config.devMode);
  setBooleanConfig(config, 'minifyJs', null, !config.devMode);
  setBooleanConfig(config, 'sourceMap', null, typeof config.sourceMap === 'undefined' ? false : config.sourceMap);
  setBooleanConfig(config, 'watch', 'watch', false);
  setBooleanConfig(config, 'buildDocs', 'docs', !config.devMode);
  setBooleanConfig(config, 'buildDist', 'esm', !config.devMode || config.buildEs5);
  setBooleanConfig(config, 'profile', 'profile', config.devMode);
  setBooleanConfig(config, 'writeLog', 'log', false);
  setBooleanConfig(config, 'buildAppCore', null, true);
  setBooleanConfig(config, 'autoprefixCss', null, config.buildEs5);
  setBooleanConfig(config, 'validateTypes', null, !config._isTesting);
  setBooleanConfig(config, 'allowInlineScripts', null, true);

  if (!isString(config.taskQueue)) {
    config.taskQueue = 'async';
  }

  // hash file names
  if (!isBoolean(config.hashFileNames)) {
    config.hashFileNames = !config.devMode;
  }
  if (!isNumber(config.hashedFileNameLength)) {
    config.hashedFileNameLength = DEFAULT_HASHED_FILENAME_LENTH;
  }
  if (config.hashedFileNameLength < MIN_HASHED_FILENAME_LENTH) {
    const err = buildError(diagnostics);
    err.messageText = `config.hashedFileNameLength must be at least ${MIN_HASHED_FILENAME_LENTH} characters`;
  }
  if (config.hashedFileNameLength > MAX_HASHED_FILENAME_LENTH) {
    const err = buildError(diagnostics);
    err.messageText = `config.hashedFileNameLength cannot be more than ${MAX_HASHED_FILENAME_LENTH} characters`;
  }
  if (!config.env) {
    config.env = {};
  }

  // get a good namespace
  validateNamespace(config, diagnostics);

  // figure out all of the config paths and absolute paths
  validatePaths(config);

  // outputTargets
  validateOutputTargets(config, diagnostics);

  // plugins
  validatePlugins(config, diagnostics);

  // rollup config
  validateRollupConfig(config);

  // dev server
  config.devServer = validateDevServer(config, diagnostics);

  // testing
  validateTesting(config, diagnostics);

  // hydrate flag
  config.hydratedFlag = validateHydrated(config);

  // bundles
  if (Array.isArray(config.bundles)) {
    config.bundles = sortBy(config.bundles, (a: ConfigBundle) => a.components.length);
  } else {
    config.bundles = [];
  }

  // validate how many workers we can use
  validateWorkers(config);

  // default devInspector to whatever devMode is
  setBooleanConfig(config, 'devInspector', null, config.devMode);

  if (!config._isTesting) {
    validateDistNamespace(config, diagnostics);
  }

  setBooleanConfig(config, 'enableCache', 'cache', true);

  if (!Array.isArray(config.watchIgnoredRegex) && config.watchIgnoredRegex != null) {
    config.watchIgnoredRegex = [config.watchIgnoredRegex];
  }
  config.watchIgnoredRegex = ((config.watchIgnoredRegex as RegExp[]) || []).reduce((arr, reg) => {
    if (reg instanceof RegExp) {
      arr.push(reg);
    }
    return arr;
  }, [] as RegExp[]);

  return {
    config,
    diagnostics,
  };
};

const DEFAULT_DEV_MODE = false;
const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;

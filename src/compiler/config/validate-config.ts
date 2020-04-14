import { Config, ConfigBundle, Diagnostic } from '../../declarations';
import { buildError, buildWarn, isBoolean, isNumber, sortBy } from '@utils';
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

export const validateConfig = (userConfig?: Config) => {
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
  config.extras.cssVarsShim = config.extras.cssVarsShim !== false;
  config.extras.dynamicImportShim = config.extras.dynamicImportShim !== false;
  config.extras.lifecycleDOMEvents = !!config.extras.lifecycleDOMEvents;
  config.extras.safari10 = config.extras.safari10 !== false;
  config.extras.scriptDataOpts = config.extras.scriptDataOpts !== false;
  config.extras.shadowDomShim = config.extras.shadowDomShim !== false;
  config.extras.slotChildNodesFix = !!config.extras.slotChildNodesFix;
  config.extras.initializeNextTick = config.extras.initializeNextTick !== false;
  config.extras.tagNameTransform = !!config.extras.tagNameTransform;

  setBooleanConfig(config, 'minifyCss', null, !config.devMode);
  setBooleanConfig(config, 'minifyJs', null, !config.devMode);
  setBooleanConfig(config, 'sourceMap', null, false);
  setBooleanConfig(config, 'watch', 'watch', false);
  setBooleanConfig(config, 'minifyCss', null, !config.devMode);
  setBooleanConfig(config, 'minifyJs', null, !config.devMode);
  setBooleanConfig(config, 'buildEs5', 'es5', !config.devMode);
  setBooleanConfig(config, 'buildDocs', 'docs', !config.devMode);
  setBooleanConfig(config, 'buildDist', 'esm', !config.devMode || config.buildEs5);
  setBooleanConfig(config, 'profile', 'profile', config.devMode);
  setBooleanConfig(config, 'writeLog', 'log', false);
  setBooleanConfig(config, 'buildAppCore', null, true);
  setBooleanConfig(config, 'autoprefixCss', null, config.buildEs5);
  setBooleanConfig(config, 'validateTypes', null, !config._isTesting);
  setBooleanConfig(config, 'allowInlineScripts', null, true);

  if (typeof config.taskQueue !== 'string') {
    config.taskQueue = 'congestionAsync';
  } else if (config.taskQueue === ('sync' as any)) {
    // deprecated 1.12.1
    config.taskQueue = 'immediate';
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

  // Default copy
  config.copy = config.copy || [];

  // validate how many workers we can use
  validateWorkers(config);

  // default devInspector to whatever devMode is
  setBooleanConfig(config, 'devInspector', null, config.devMode);

  if (!config._isTesting) {
    validateDistNamespace(config, diagnostics);
  }

  setBooleanConfig(config, 'enableCache', 'cache', true);

  if (config.excludeSrc) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `"excludeSrc" is deprecated, use the "exclude" option in tsconfig.json`;
  }

  if (config.includeSrc) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `"includeSrc" is deprecated, use the "include" option in tsconfig.json`;
  }

  return {
    config,
    diagnostics,
  };
};

const DEFAULT_DEV_MODE = false;
const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;

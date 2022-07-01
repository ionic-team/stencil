import { ConfigBundle, Diagnostic, ValidatedConfig, UnvalidatedConfig } from '../../declarations';
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
 * Represents the results of validating a previously unvalidated configuration
 */
type ConfigValidationResults = {
  /**
   * The validated configuration, with well-known default values set if they weren't previously provided
   */
  config: ValidatedConfig;
  /**
   * A collection of errors and warnings that occurred during the configuration validation process
   */
  diagnostics: Diagnostic[];
};

/**
 * Validate a Config object, ensuring that all its field are present and
 * consistent with our expectations. This function transforms an
 * `UnvalidatedConfig` to a `Config`.
 *
 * @param userConfig an unvalidated config that we've gotten from a user
 * @returns an object with config and diagnostics props
 */
export const validateConfig = (userConfig: UnvalidatedConfig = {}): ConfigValidationResults => {
  const config = Object.assign({}, userConfig || {}); // not positive it's json safe
  const diagnostics: Diagnostic[] = [];

  const validatedConfig: ValidatedConfig = {
    ...config,
    // flags _should_ be JSON safe
    flags: JSON.parse(JSON.stringify(config.flags || {})),
  };

  // default devMode false
  if (validatedConfig.flags.prod) {
    validatedConfig.devMode = false;
  } else if (validatedConfig.flags.dev) {
    validatedConfig.devMode = true;
  } else if (!isBoolean(validatedConfig.devMode)) {
    validatedConfig.devMode = DEFAULT_DEV_MODE;
  }

  validatedConfig.extras = validatedConfig.extras || {};
  validatedConfig.extras.appendChildSlotFix = !!validatedConfig.extras.appendChildSlotFix;
  validatedConfig.extras.cloneNodeFix = !!validatedConfig.extras.cloneNodeFix;
  validatedConfig.extras.cssVarsShim = !!validatedConfig.extras.cssVarsShim;
  validatedConfig.extras.dynamicImportShim = !!validatedConfig.extras.dynamicImportShim;
  validatedConfig.extras.lifecycleDOMEvents = !!validatedConfig.extras.lifecycleDOMEvents;
  validatedConfig.extras.safari10 = !!validatedConfig.extras.safari10;
  validatedConfig.extras.scriptDataOpts = !!validatedConfig.extras.scriptDataOpts;
  validatedConfig.extras.shadowDomShim = !!validatedConfig.extras.shadowDomShim;
  validatedConfig.extras.slotChildNodesFix = !!validatedConfig.extras.slotChildNodesFix;
  validatedConfig.extras.initializeNextTick = !!validatedConfig.extras.initializeNextTick;
  validatedConfig.extras.tagNameTransform = !!validatedConfig.extras.tagNameTransform;

  validatedConfig.buildEs5 =
    validatedConfig.buildEs5 === true || (!validatedConfig.devMode && validatedConfig.buildEs5 === 'prod');

  setBooleanConfig(validatedConfig, 'minifyCss', null, !validatedConfig.devMode);
  setBooleanConfig(validatedConfig, 'minifyJs', null, !validatedConfig.devMode);
  setBooleanConfig(
    validatedConfig,
    'sourceMap',
    null,
    typeof validatedConfig.sourceMap === 'undefined' ? false : validatedConfig.sourceMap
  );
  setBooleanConfig(validatedConfig, 'watch', 'watch', false);
  setBooleanConfig(validatedConfig, 'buildDocs', 'docs', !validatedConfig.devMode);
  setBooleanConfig(validatedConfig, 'buildDist', 'esm', !validatedConfig.devMode || validatedConfig.buildEs5);
  setBooleanConfig(validatedConfig, 'profile', 'profile', validatedConfig.devMode);
  setBooleanConfig(validatedConfig, 'writeLog', 'log', false);
  setBooleanConfig(validatedConfig, 'buildAppCore', null, true);
  setBooleanConfig(validatedConfig, 'autoprefixCss', null, validatedConfig.buildEs5);
  setBooleanConfig(validatedConfig, 'validateTypes', null, !validatedConfig._isTesting);
  setBooleanConfig(validatedConfig, 'allowInlineScripts', null, true);

  if (!isString(validatedConfig.taskQueue)) {
    validatedConfig.taskQueue = 'async';
  }

  // hash file names
  if (!isBoolean(validatedConfig.hashFileNames)) {
    validatedConfig.hashFileNames = !validatedConfig.devMode;
  }
  if (!isNumber(validatedConfig.hashedFileNameLength)) {
    validatedConfig.hashedFileNameLength = DEFAULT_HASHED_FILENAME_LENTH;
  }
  if (validatedConfig.hashedFileNameLength < MIN_HASHED_FILENAME_LENTH) {
    const err = buildError(diagnostics);
    err.messageText = `validatedConfig.hashedFileNameLength must be at least ${MIN_HASHED_FILENAME_LENTH} characters`;
  }
  if (validatedConfig.hashedFileNameLength > MAX_HASHED_FILENAME_LENTH) {
    const err = buildError(diagnostics);
    err.messageText = `validatedConfig.hashedFileNameLength cannot be more than ${MAX_HASHED_FILENAME_LENTH} characters`;
  }
  if (!validatedConfig.env) {
    validatedConfig.env = {};
  }

  // get a good namespace
  validateNamespace(validatedConfig, diagnostics);

  // figure out all of the config paths and absolute paths
  validatePaths(validatedConfig);

  // outputTargets
  validateOutputTargets(validatedConfig, diagnostics);

  // plugins
  validatePlugins(validatedConfig, diagnostics);

  // rollup config
  validateRollupConfig(validatedConfig);

  // dev server
  validatedConfig.devServer = validateDevServer(validatedConfig, diagnostics);

  // testing
  validateTesting(validatedConfig, diagnostics);

  // hydrate flag
  validatedConfig.hydratedFlag = validateHydrated(validatedConfig);

  // bundles
  if (Array.isArray(validatedConfig.bundles)) {
    validatedConfig.bundles = sortBy(validatedConfig.bundles, (a: ConfigBundle) => a.components.length);
  } else {
    validatedConfig.bundles = [];
  }

  // validate how many workers we can use
  validateWorkers(validatedConfig);

  // default devInspector to whatever devMode is
  setBooleanConfig(validatedConfig, 'devInspector', null, validatedConfig.devMode);

  if (!validatedConfig._isTesting) {
    validateDistNamespace(validatedConfig, diagnostics);
  }

  setBooleanConfig(validatedConfig, 'enableCache', 'cache', true);

  if (!Array.isArray(validatedConfig.watchIgnoredRegex) && validatedConfig.watchIgnoredRegex != null) {
    validatedConfig.watchIgnoredRegex = [validatedConfig.watchIgnoredRegex];
  }
  validatedConfig.watchIgnoredRegex = ((validatedConfig.watchIgnoredRegex as RegExp[]) || []).reduce((arr, reg) => {
    if (reg instanceof RegExp) {
      arr.push(reg);
    }
    return arr;
  }, [] as RegExp[]);

  return {
    config: validatedConfig,
    diagnostics,
  };
};

const DEFAULT_DEV_MODE = false;
const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;

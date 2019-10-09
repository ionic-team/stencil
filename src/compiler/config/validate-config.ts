import * as d from '../../declarations';
import { buildError, sortBy } from '@utils';
import { validateDevServer } from './validate-dev-server';
import { validateDistNamespace, validateNamespace } from './validate-namespace';
import { validateOutputTargets } from './validate-outputs';
import { validatePaths } from './validate-paths';
import { setArrayConfig, setBooleanConfig, setNumberConfig } from './config-utils';
import { validateTesting } from './validate-testing';
import { validateWorkers } from './validate-workers';
import { validateOutputTargetCustom } from './validate-outputs-custom';
import { validatePlugins } from './validate-plugins';
import { validateRollupConfig } from './validate-rollup-config';

export function validateConfig(config: d.Config): { config: d.Config, diagnostics: d.Diagnostic[] } {
  const diagnostics: d.Diagnostic[] = [];
  if (config == null) {
    const err = buildError(diagnostics);
    err.messageText = `invalid build config`;
    return {
      config: null,
      diagnostics
    };
  }

  if (config._isValidated) {
    // don't bother if we've already validated this config
    return {
      config,
      diagnostics
    };
  }

  if (typeof config.rootDir !== 'string') {
    config.rootDir = '/';
  }

  config.flags = config.flags || {};

  setBooleanConfig(config, 'writeLog', 'log', false);
  setBooleanConfig(config, 'buildAppCore', null, true);

  // default devMode false
  if (config.flags.prod) {
    config.devMode = false;

  } else if (config.flags.dev) {
    config.devMode = true;

  } else {
    setBooleanConfig(config, 'devMode', null, DEFAULT_DEV_MODE);
  }

  // Default copy
  config.copy = config.copy || [];

  // get a good namespace
  validateNamespace(config, diagnostics);

  // figure out all of the config paths and absolute paths
  validatePaths(config);

  // validate how many workers we can use
  validateWorkers(config);

  // default devInspector to whatever devMode is
  setBooleanConfig(config, 'devInspector', null, config.devMode);

  // default watch false
  setBooleanConfig(config, 'watch', 'watch', false);

  setBooleanConfig(config, 'minifyCss', null, !config.devMode);
  setBooleanConfig(config, 'minifyJs', null, !config.devMode);

  setBooleanConfig(config, 'buildEs5', 'es5', !config.devMode);
  setBooleanConfig(config, 'buildDist', 'esm', !config.devMode || config.buildEs5);

  // setup the outputTargets
  validateOutputTargets(config, diagnostics);

  if (!config._isTesting) {
    validateDistNamespace(config, diagnostics);
  }

  if (typeof config.validateTypes !== 'boolean') {
    config.validateTypes = true;
  }

  setBooleanConfig(config, 'hashFileNames', null, !config.devMode);
  setNumberConfig(config, 'hashedFileNameLength', null, DEFAULT_HASHED_FILENAME_LENTH);

  if (config.hashFileNames) {
    if (config.hashedFileNameLength < MIN_HASHED_FILENAME_LENTH) {
      const err = buildError(diagnostics);
      err.messageText = `config.hashedFileNameLength must be at least ${MIN_HASHED_FILENAME_LENTH} characters`;
    }
    if (config.hashedFileNameLength > MAX_HASHED_FILENAME_LENTH) {
      const err = buildError(diagnostics);
      err.messageText = `config.hashedFileNameLength cannot be more than ${MAX_HASHED_FILENAME_LENTH} characters`;
    }
  }

  validateDevServer(config, diagnostics);

  if (!config.watchIgnoredRegex) {
    config.watchIgnoredRegex = DEFAULT_WATCH_IGNORED_REGEX;
  }

  setBooleanConfig(config, 'generateDocs', 'docs', false);
  setBooleanConfig(config, 'enableCache', 'cache', true);

  if (!Array.isArray(config.includeSrc)) {
    config.includeSrc = DEFAULT_INCLUDES.map(include => {
      return config.sys.path.join(config.srcDir, include);
    });
  }

  if (!Array.isArray(config.excludeSrc)) {
    config.excludeSrc = DEFAULT_EXCLUDES.map(include => {
      return config.sys.path.join(config.srcDir, include);
    });
  }

  validatePlugins(config, diagnostics);
  setArrayConfig(config, 'bundles');
  config.bundles = sortBy(config.bundles, (a: d.ConfigBundle) => a.components.length);

  // set to true so it doesn't bother going through all this again on rebuilds
  config._isValidated = true;

  validateRollupConfig(config);
  validateTesting(config, diagnostics);
  validateOutputTargetCustom(config, diagnostics);

  return {
    config,
    diagnostics
  };
}


const DEFAULT_DEV_MODE = false;
const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;
const DEFAULT_INCLUDES = ['**/*.ts', '**/*.tsx'];
const DEFAULT_EXCLUDES = ['**/test/**'];
const DEFAULT_WATCH_IGNORED_REGEX = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/i;

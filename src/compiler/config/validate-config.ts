import * as d from '../../declarations';
import { setArrayConfig, setBooleanConfig, setNumberConfig } from './config-utils';
import { validateAssetVerioning } from './validate-asset-versioning';
import { validateDevServer } from './validate-dev-server';
import { validateNamespace } from './validate-namespace';
import { validateOutputTargets } from './validate-outputs';
import { validatePaths } from './validate-paths';
import { validatePlugins } from './validate-plugins';
import { validateRollupConfig } from './validate-rollup-config';
import { validateTesting } from './validate-testing';
import { validateWorkers } from './validate-workers';
import { sortBy } from '@utils';


export function validateConfig(config: d.Config, setEnvVariables?: boolean) {
  if (!config) {
    throw new Error(`invalid build config`);
  }

  if (config._isValidated) {
    // don't bother if we've already validated this config
    return config;
  }

  if (typeof config.rootDir !== 'string') {
    throw new Error('config.rootDir required');
  }

  config.flags = config.flags || {};

  if (config.flags.debug || config.flags.verbose) {
    config.logLevel = 'debug';
  } else if (config.flags.logLevel) {
    config.logLevel = config.flags.logLevel;
  } else if (typeof config.logLevel !== 'string') {
    config.logLevel = 'info';
  }
  config.logger.level = config.logLevel;

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
  validateNamespace(config);

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
  setBooleanConfig(config, 'buildDist', 'esm', config.buildEs5);
  setBooleanConfig(config, 'buildScoped', null, config.buildEs5);

  /**
   * validate plugins becore output targets because some plugins will be registered
   * for output targets
   */

  validatePlugins(config);

  // setup the outputTargets
  validateOutputTargets(config);

  if (typeof config.validateTypes !== 'boolean') {
    config.validateTypes = true;
  }

  setBooleanConfig(config, 'hashFileNames', null, !config.devMode);
  setNumberConfig(config, 'hashedFileNameLength', null, DEFAULT_HASHED_FILENAME_LENTH);

  if (config.hashFileNames) {
    if (config.hashedFileNameLength < MIN_HASHED_FILENAME_LENTH) {
      throw new Error(`config.hashedFileNameLength must be at least ${MIN_HASHED_FILENAME_LENTH} characters`);
    }
    if (config.hashedFileNameLength > MAX_HASHED_FILENAME_LENTH) {
      throw new Error(`config.hashedFileNameLength cannot be more than ${MAX_HASHED_FILENAME_LENTH} characters`);
    }
  }


  validateAssetVerioning(config);

  validateDevServer(config);

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
    config.excludeSrc = DEFAULT_EXCLUDES.slice();
  }

  setArrayConfig(config, 'plugins');
  setArrayConfig(config, 'bundles');
  config.bundles = sortBy(config.bundles, (a) => a.components.length);

  // set to true so it doesn't bother going through all this again on rebuilds
  config._isValidated = true;

  if (setEnvVariables !== false) {
    setProcessEnvironment(config);
  }

  validateRollupConfig(config);
  validateTesting(config);

  return config;
}


export function setProcessEnvironment(config: d.Config) {
  process.env.NODE_ENV = config.devMode ? 'development' : 'production';
}


const DEFAULT_DEV_MODE = false;
const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;
const DEFAULT_INCLUDES = ['**/*.ts', '**/*.tsx'];
const DEFAULT_EXCLUDES = ['**/*.+(spec|e2e).*'];
const DEFAULT_WATCH_IGNORED_REGEX = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/i;

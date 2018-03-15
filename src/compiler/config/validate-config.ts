import { Config } from '../../declarations';
import { setArrayConfig, setBooleanConfig, setNumberConfig, setStringConfig } from './config-utils';
import { validateAssetVerioning } from './validate-asset-versioning';
import { validateCopy } from './validate-copy';
import { validateNamespace } from './validate-namespace';
import { validateOutputTargets } from './validate-outputs';
import { validatePaths } from './validate-paths';
import { validatePlugins } from './validate-plugins';
import { _deprecatedValidateConfigCollections } from './_deprecated-validate-config-collection';


export function validateConfig(config: Config, setEnvVariables?: boolean) {
  if (!config) {
    throw new Error(`invalid build config`);
  }

  if (config._isValidated) {
    // don't bother if we've already validated this config
    return config;
  }

  if (!config.logger) {
    throw new Error(`config.logger required`);
  }
  if (!config.rootDir) {
    throw new Error('config.rootDir required');
  }
  if (!config.sys) {
    throw new Error('config.sys required');
  }

  config.flags = config.flags || {};

  if (config.flags.debug) {
    config.logLevel = 'debug';
  } else if (config.flags.logLevel) {
    config.logLevel = config.flags.logLevel;
  } else if (typeof config.logLevel !== 'string') {
    config.logLevel = 'info';
  }
  config.logger.level = config.logLevel;

  setBooleanConfig(config, 'writeLog', 'log', false);
  setBooleanConfig(config, 'buildAppCore', null, true);

  // get a good namespace
  validateNamespace(config);

  // figure out all of the config paths and absolute paths
  validatePaths(config);

  // setup the outputTargets
  validateOutputTargets(config);

  // default devMode false
  if (config.flags.prod) {
    config.devMode = false;

  } else if (config.flags.dev) {
    config.devMode = true;

  } else {
    setBooleanConfig(config, 'devMode', null, DEFAULT_DEV_MODE);
  }

  // default devInspector to whatever devMode is
  setBooleanConfig(config, 'devInspector', null, config.devMode);

  // default watch false
  setBooleanConfig(config, 'watch', 'watch', false);

  setBooleanConfig(config, 'minifyCss', null, !config.devMode);
  setBooleanConfig(config, 'minifyJs', null, !config.devMode);

  config.logger.debug(`minifyJs: ${config.minifyJs}, minifyCss: ${config.minifyCss}`);

  setBooleanConfig(config, 'buildEs5', 'es5', !config.devMode);

  setBooleanConfig(config, 'hashFileNames', null, !(config.devMode || config.watch));
  setNumberConfig(config, 'hashedFileNameLength', null, DEFAULT_HASHED_FILENAME_LENTH);

  if (config.hashFileNames) {
    if (config.hashedFileNameLength < MIN_HASHED_FILENAME_LENTH) {
      throw new Error(`config.hashedFileNameLength must be at least ${MIN_HASHED_FILENAME_LENTH} characters`);
    }
    if (config.hashedFileNameLength > MAX_HASHED_FILENAME_LENTH) {
      throw new Error(`config.hashedFileNameLength cannot be more than ${MAX_HASHED_FILENAME_LENTH} characters`);
    }
  }
  config.logger.debug(`hashFileNames: ${config.hashFileNames}, hashedFileNameLength: ${config.hashedFileNameLength}`);

  validateCopy(config);

  validatePlugins(config);

  validateAssetVerioning(config);

  if (!config.watchIgnoredRegex) {
    config.watchIgnoredRegex = DEFAULT_WATCH_IGNORED_REGEX;
  }

  setStringConfig(config, 'hydratedCssClass', DEFAULT_HYDRATED_CSS_CLASS);
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

  /**
   * DEPRECATED "config.collections" since 0.6.0, 2018-02-13
   */
  _deprecatedValidateConfigCollections(config);

  setArrayConfig(config, 'plugins');
  setArrayConfig(config, 'bundles');

  // set to true so it doesn't bother going through all this again on rebuilds
  config._isValidated = true;

  config.logger.debug(`validated build config`);

  if (setEnvVariables !== false) {
    setProcessEnvironment(config);
  }

  return config;
}


export function setProcessEnvironment(config: Config) {
  process.env.NODE_ENV = config.devMode ? 'development' : 'production';
}


const DEFAULT_DEV_MODE = false;
const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;
const DEFAULT_INCLUDES = ['**/*.ts', '**/*.tsx'];
const DEFAULT_EXCLUDES = ['**/test/**', '**/*.spec.*'];
const DEFAULT_WATCH_IGNORED_REGEX = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/i;
const DEFAULT_HYDRATED_CSS_CLASS = 'hydrated';

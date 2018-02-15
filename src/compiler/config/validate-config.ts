import { Config } from '../../declarations';
import { setArrayConfig, setBooleanConfig, setNumberConfig, setStringConfig } from './config-utils';
import { validateCopy } from './validate-copy';
import { validateNamespace } from './validate-namespace';
import { validatePaths } from './validate-paths';
import { validatePlugins } from './validate-plugins';
import { validatePublicPath } from './validate-public-path';
import { _deprecatedValidateConfigCollections } from './_deprecated-validate-config-collection';


export function validateBuildConfig(config: Config, setEnvVariables?: boolean) {
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

  if (typeof config.logLevel === 'string') {
    config.logger.level = config.logLevel;
  } else if (typeof config.logger.level === 'string') {
    config.logLevel = config.logger.level;
  }

  setBooleanConfig(config, 'writeLog', false);
  setBooleanConfig(config, 'writeStats', false);
  setBooleanConfig(config, 'buildAppCore', true);

  // get a good namespace
  validateNamespace(config);

  // figure out all of the config paths and absolute paths
  validatePaths(config);

  // figure out the client-side public path
  validatePublicPath(config);

  // default devMode false
  config.devMode = !!config.devMode;

  // default watch false
  config.watch = !!config.watch;

  setBooleanConfig(config, 'minifyCss', !config.devMode);
  setBooleanConfig(config, 'minifyJs', !config.devMode);

  config.logger.debug(`minifyJs: ${config.minifyJs}, minifyCss: ${config.minifyCss}`);

  setBooleanConfig(config, 'buildEs5', !config.devMode);

  setBooleanConfig(config, 'hashFileNames', !(config.devMode || config.watch));
  setNumberConfig(config, 'hashedFileNameLength', DEFAULT_HASHED_FILENAME_LENTH);

  if (config.hashFileNames) {
    if (config.hashedFileNameLength < MIN_HASHED_FILENAME_LENTH) {
      throw new Error(`config.hashedFileNameLength must be at least ${MIN_HASHED_FILENAME_LENTH} characters`);
    }
    if (config.hashedFileNameLength > MAX_HASHED_FILENAME_LENTH) {
      throw new Error(`config.hashedFileNameLength cannot be more than ${MAX_HASHED_FILENAME_LENTH} characters`);
    }
  }
  config.logger.debug(`hashFileNames: ${config.hashFileNames}, hashedFileNameLength: ${config.hashedFileNameLength}`);

  config.generateDistribution = !!config.generateDistribution;

  setBooleanConfig(config, 'generateWWW', true);

  validateCopy(config);

  validatePlugins(config);

  if (!config.watchIgnoredRegex) {
    config.watchIgnoredRegex = DEFAULT_WATCH_IGNORED_REGEX;
  }

  setStringConfig(config, 'hydratedCssClass', DEFAULT_HYDRATED_CSS_CLASS);
  setBooleanConfig(config, 'emptyDist', true);
  setBooleanConfig(config, 'emptyWWW', true);
  setBooleanConfig(config, 'generateDocs', false);
  setBooleanConfig(config, 'enableCache', true);

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


const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;
const DEFAULT_INCLUDES = ['**/*.ts', '**/*.tsx'];
const DEFAULT_EXCLUDES = ['**/test/**', '**/*.spec.*'];
const DEFAULT_WATCH_IGNORED_REGEX = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/i;
const DEFAULT_HYDRATED_CSS_CLASS = 'hydrated';

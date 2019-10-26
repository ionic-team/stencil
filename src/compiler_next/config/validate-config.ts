import { Config, ConfigBundle, Diagnostic } from '../../declarations';
import { buildError, isBoolean, sortBy } from '@utils';
import { validateDevServer } from './validate-dev-server';
import { validateNamespace } from './validate-namespace';
import { validateOutputTargets } from './outputs';
import { validatePaths } from './validate-paths';
import { validatePlugins } from './validate-plugins';
import { validateRollupConfig } from '../../compiler/config/validate-rollup-config';
import { validateTesting } from '../../compiler/config/validate-testing';
import { validateWorkers } from './validate-workers';
import { setBooleanConfig } from '../../compiler/config/config-utils';
import path from 'path';


export const validateConfig = (userConfig?: Config) => {
  const config = Object.assign({}, userConfig || {}); // not positive it's json safe
  const diagnostics: Diagnostic[] = [];

  // old way
  config.sys = config.sys || {};
  config.sys.path = path;

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

  setBooleanConfig(config, 'minifyCss', null, !config.devMode);
  setBooleanConfig(config, 'minifyJs', null, !config.devMode);
  setBooleanConfig(config, 'sourceMap', null, false);

  // hash file names
  if (!isBoolean(config.hashFileNames)) {
    config.hashFileNames = !config.devMode;
  }
  if (typeof config.hashedFileNameLength !== 'number') {
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
  config.devServer = validateDevServer(config, config.flags, diagnostics);

  // testing
  validateTesting(config, diagnostics);

  // bundles
  if (Array.isArray(config.bundles)) {
    config.bundles = sortBy(config.bundles, (a: ConfigBundle) => a.components.length);
  } else {
    config.bundles = [];
  }

  setBooleanConfig(config, 'writeLog', 'log', false);
  setBooleanConfig(config, 'buildAppCore', null, true);

  // Default copy
  config.copy = config.copy || [];

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

  // if (!config._isTesting) {
  //   validateDistNamespace(config, diagnostics);
  // }

  // if (typeof config.validateTypes !== 'boolean') {
  //   config.validateTypes = true;
  // }

  // if (!config.watchIgnoredRegex) {
  //   config.watchIgnoredRegex = DEFAULT_WATCH_IGNORED_REGEX;
  // }

  setBooleanConfig(config, 'generateDocs', 'docs', false);
  setBooleanConfig(config, 'enableCache', 'cache', true);

  // if (!Array.isArray(config.includeSrc)) {
  //   config.includeSrc = DEFAULT_INCLUDES.map(include => {
  //     return config.sys.path.join(config.srcDir, include);
  //   });
  // }

  // if (!Array.isArray(config.excludeSrc)) {
  //   config.excludeSrc = DEFAULT_EXCLUDES.map(include => {
  //     return config.sys.path.join(config.srcDir, include);
  //   });
  // }

  // set to true so it doesn't bother going through all this again on rebuilds
  // config._isValidated = true;

  // validateOutputTargetCustom(config, diagnostics);

  return {
    config,
    diagnostics
  };
};


const DEFAULT_DEV_MODE = false;
const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;
// const DEFAULT_INCLUDES = ['**/*.ts', '**/*.tsx'];
// const DEFAULT_EXCLUDES = ['**/test/**'];
// const DEFAULT_WATCH_IGNORED_REGEX = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/i;

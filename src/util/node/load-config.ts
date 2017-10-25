import { BuildConfig, Logger } from '../../util/interfaces';
import { getNodeSys } from './node-sys';
import { NodeLogger } from './node-logger';


export function loadConfig(config: string | BuildConfig) {
  const logger = new NodeLogger({ process });

  if (!config || Array.isArray(config) || typeof config === 'function' || typeof config === 'number' || typeof config === 'boolean') {
    logger.error(`Invalid config: ${config}`);
    process.exit(1);
  }

  let buildConfig: BuildConfig;
  let configPath: string;

  if (typeof config === 'string') {
    configPath = config;
    buildConfig = loadConfigFile(process, configPath, logger);

  } else {
    // looks like it's already a build config object
    buildConfig = (config as BuildConfig);
  }

  if (!buildConfig.logger) {
    // if a logger was not provided then use the
    // defaul stencil command line logger found in bin
    buildConfig.logger = logger;
  }

  if (!buildConfig.sys) {
    // if the config was not provided then use the default node sys
    const path = require('path');
    buildConfig.sys = getNodeSys(path.join(__dirname, '../'), buildConfig.logger);
  }

  return buildConfig;
}


export function loadConfigFile(process: NodeJS.Process, configPath: string, logger: Logger) {
  const fs = require('fs');
  const path = require('path');
  let config: BuildConfig;

  if (!path.isAbsolute(configPath)) {
    logger.error(`Stencil configuration file "${configPath}" must be an absolute path.`);
    process.exit(1);
  }

  try {
    const fileStat = fs.statSync(configPath);
    if (fileStat.isDirectory()) {
      // this is only a directory, so let's just assume we're looking for in stencil.config.js
      // otherwise they could pass in an absolute path if it was somewhere else
      configPath = path.join(configPath, 'stencil.config.js');
    }

    // the passed in config was a string, so it's probably a path to the config we need to load
    const configFileData = require(configPath);
    if (!configFileData.config) {
      logger.error(`Invalid Stencil configuration file "${configPath}". Missing "config" property.`);
      process.exit(1);
    }

    config = configFileData.config;
    config.configPath = configPath;

    if (!config.rootDir && configPath) {
      config.rootDir = path.dirname(configPath);
    }

  } catch (e) {
    logger.error(`Error reading Stencil configuration file "${configPath}".`, e);
    process.exit(1);
  }

  return config;
}

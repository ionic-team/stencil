import { BuildConfig } from '../util/interfaces';
import { validateBuildConfig } from '../compiler/build/validation';
import * as fs from 'fs';
import * as path from 'path';


export function loadConfig(config: string | BuildConfig) {
  if (!config || Array.isArray(config) || typeof config === 'function' || typeof config === 'number' || typeof config === 'boolean') {
    console.error(`Invalid config: ${config}`);
    process.exit(1);
  }

  let rtnConfig: BuildConfig;
  let configPath: string;

  if (typeof config === 'string') {
    configPath = config;
    rtnConfig = loadConfigFromPath(configPath);

  } else {
    // looks like it's already a build config object
    rtnConfig = (config as BuildConfig);
  }

  if (!rtnConfig.sys) {
    // if the config was not provided then use the
    // defaul stencil sys found in bin
    rtnConfig.sys = require(path.join(__dirname, '../bin/sys'));
  }

  if (!rtnConfig.logger) {
    // if a logger was not provided then use the
    // defaul stencil command line logger found in bin
    const logger = require(path.join(__dirname, '../cli/util')).logger;
    rtnConfig.logger = new logger.CommandLineLogger({
      level: rtnConfig.logLevel,
      process: process
    });
  }

  return validateBuildConfig(rtnConfig, false);
}


function loadConfigFromPath(configPath: string) {
  let config: BuildConfig;

  if (!path.isAbsolute(configPath)) {
    console.error(`Stencil configuration file "${configPath}" must be an absolute path.`);
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
      console.error(`Invalid Stencil configuration file "${configPath}". Missing "config" property.`);
      process.exit(1);
    }

    config = configFileData.config;
    config.configPath = configPath;

  } catch (e) {
    console.error(`Error reading Stencil "${configPath}" configuration file.`, e);
    process.exit(1);
  }

  if (!config.rootDir && configPath) {
    config.rootDir = path.dirname(configPath);
  }

  return config;
}

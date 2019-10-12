import * as d from '../../declarations';
import { createStencilSys } from './stencil-sys';
import { createLogger } from './logger';
import path from 'path';


export const getConfig = (userConfig: d.Config) => {
  const config = Object.assign(userConfig, {});

  if (!config.logger) {
    config.logger = createLogger();
  }

  if (!config.sys_next) {
    config.sys_next = createStencilSys();
  }

  if (config.flags.debug || config.flags.verbose) {
    config.logLevel = 'debug';
  } else if (config.flags.logLevel) {
    config.logLevel = config.flags.logLevel;
  } else if (typeof config.logLevel !== 'string') {
    config.logLevel = 'info';
  }
  config.logger.level = config.logLevel;

  if (!config.sys) {
    // old way
    config.sys = config.sys || {};
    config.sys.path = path;
  }

  return config;
};

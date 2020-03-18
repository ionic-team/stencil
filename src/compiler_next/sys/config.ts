import * as d from '../../declarations';
import { createLogger } from './logger';
import { createSystem } from './stencil-sys';

export const getConfig = (userConfig: d.Config) => {
  const config = { ...userConfig };

  if (!config.logger) {
    config.logger = createLogger();
  }

  if (!config.sys) {
    config.sys = createSystem();
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

  return config;
};

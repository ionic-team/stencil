import type * as d from '../../declarations';
import { createLogger } from './logger/console-logger';
import { createSystem } from './stencil-sys';
import { setPlatformPath } from '../sys/modules/path';

export const getConfig = (userConfig: d.Config): d.ValidatedConfig => {
  const flags = userConfig.flags ?? {};
  const logger = userConfig.logger ?? createLogger();
  const config: d.ValidatedConfig = { ...userConfig, flags, logger };

  if (!config.sys) {
    config.sys = createSystem({ logger: config.logger });
  }

  setPlatformPath(config.sys.platformPath);

  if (config.flags.debug || config.flags.verbose) {
    config.logLevel = 'debug';
  } else if (config.flags.logLevel) {
    config.logLevel = config.flags.logLevel;
  } else if (typeof config.logLevel !== 'string') {
    config.logLevel = 'info';
  }
  config.logger.setLevel(config.logLevel);

  return config;
};

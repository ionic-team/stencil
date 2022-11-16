import { createConfigFlags } from '../../cli/config-flags';
import type * as d from '../../declarations';
import { setPlatformPath } from '../sys/modules/path';
import { createLogger } from './logger/console-logger';
import { createSystem } from './stencil-sys';

export const getConfig = (userConfig: d.Config): d.ValidatedConfig => {
  const logger = userConfig.logger ?? createLogger();
  const config: d.ValidatedConfig = {
    ...userConfig,
    flags: createConfigFlags(userConfig.flags ?? {}),
    logger,
    outputTargets: userConfig.outputTargets ?? [],
    rootDir: userConfig.rootDir ?? '/',
    sys: userConfig.sys ?? createSystem({ logger }),
    testing: userConfig ?? {},
  };

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

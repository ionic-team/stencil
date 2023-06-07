import { createConfigFlags } from '../../cli/config-flags';
import type * as d from '../../declarations';
import { validateConfig } from '../config/validate-config';
import { createLogger } from './logger/console-logger';

export const getConfig = (userConfig: d.Config): d.ValidatedConfig => {
  const logger = userConfig.logger ?? createLogger();
  const flags = createConfigFlags(userConfig.flags ?? {});
  userConfig.logger = logger;
  userConfig.flags = flags;
  const config: d.ValidatedConfig = validateConfig(userConfig, {}).config;

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

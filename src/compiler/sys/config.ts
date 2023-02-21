import { join } from 'path';

import { createConfigFlags } from '../../cli/config-flags';
import type * as d from '../../declarations';
import { setPlatformPath } from '../sys/modules/path';
import { createLogger } from './logger/console-logger';
import { createSystem } from './stencil-sys';

export const getConfig = (userConfig: d.Config): d.ValidatedConfig => {
  const logger = userConfig.logger ?? createLogger();
  const rootDir = userConfig.rootDir ?? '/';
  const config: d.ValidatedConfig = {
    ...userConfig,
    flags: createConfigFlags(userConfig.flags ?? {}),
    hydratedFlag: userConfig.hydratedFlag ?? null,
    logger,
    outputTargets: userConfig.outputTargets ?? [],
    packageJsonFilePath: join(rootDir, 'package.json'),
    rootDir,
    sys: userConfig.sys ?? createSystem({ logger }),
    testing: userConfig ?? {},
    transformAliasedImportPaths: userConfig.transformAliasedImportPaths ?? false,
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

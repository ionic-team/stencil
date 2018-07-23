import * as d from '../declarations';
import { getConfigFilePath } from './cli-utils';
import { parseFlags } from './parse-flags';
import { runTask } from './run-task';
import { shouldIgnoreError } from '../compiler/util';


export async function run(process: NodeJS.Process, sys: d.StencilSystem, logger: d.Logger) {
  process.on(`unhandledRejection`, (r: any) => {
    if (!shouldIgnoreError(r)) {
      logger.error(`unhandledRejection`, r);
    }
  });

  process.title = `Stencil`;

  const flags = parseFlags(process);

  // load the config file
  let config: d.Config;
  try {
    const configPath = getConfigFilePath(process, sys, flags.config);
    config = sys.loadConfigFile(configPath, process);

  } catch (e) {
    logger.error(e);
    process.exit(1);
  }

  try {
    if (!config.logger) {
      // if a logger was not provided then use the
      // default stencil command line logger
      config.logger = logger;
    }

    if (config.logLevel) {
      config.logger.level = config.logLevel;
    }

    if (!config.sys) {
      // if the config was not provided then use the default node sys
      config.sys = sys;
    }

    config.flags = flags;

    process.title = `Stencil: ${config.namespace}`;

    await runTask(process, config, flags);

  } catch (e) {
    if (!shouldIgnoreError(e)) {
      config.logger.error(`uncaught cli error: ${e}`);
      process.exit(1);
    }
  }
}

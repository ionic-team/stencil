import * as d from '../declarations';
import { getConfigFilePath } from './cli-utils';
import { parseFlags } from './parse-flags';
import { runTask } from './run-task';
import { shouldIgnoreError } from '@utils';
import exit from 'exit';


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

    // if --config is provided we need to check if it exists
    if (flags.config && !sys.fs.existsSync(configPath)) {
      throw new Error(`Stencil configuration file cannot be found at: "${flags.config}"`);
    }
    config = sys.loadConfigFile(configPath, process);

    config.sys = (config.sys || sys);
    config.logger = (config.logger || logger);

  } catch (e) {
    logger.error(e);
    exit(1);
  }

  try {
    if (typeof config.logLevel === 'string') {
      config.logger.level = config.logLevel;
    }

    config.flags = flags;

    process.title = `Stencil: ${config.namespace}`;

    await runTask(process, config, flags);

  } catch (e) {
    if (!shouldIgnoreError(e)) {
      config.logger.error(`uncaught cli error: ${e}${config.logger.level === 'debug' ? e.stack : ''}`);
      exit(1);
    }
  }
}

export { parseFlags } from './parse-flags';

import { Compiler as CompilerType } from '../compiler';
import { Config, Logger, StencilSystem } from '../declarations';
import { getConfigFilePath, hasError } from './cli-utils';
import { help } from './task-help';
import { initApp } from './task-init';
import { parseFlags } from './parse-flags';


export async function run(process: NodeJS.Process, sys: StencilSystem, logger: Logger) {
  process.on('unhandledRejection', (r: any) => logger.error(r));

  const flags = parseFlags(process);

  if (flags.help || flags.task === 'help') {
    help(process, logger);
    process.exit(0);
  }

  if (flags.task === 'init') {
    initApp(process, sys, logger);
    process.exit(0);
  }

  if (flags.version) {
    console.log(sys.compiler.version);
    process.exit(0);
  }

  // load the config file
  let config: Config;
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

    const { Compiler } = require('../compiler/index.js');

    const compiler: CompilerType = new Compiler(config);
    if (!compiler.isValid) {
      process.exit(1);
    }

    process.title = `Stencil: ${config.namespace}`;

    switch (flags.task) {
      case 'build':
        const results = await compiler.build();
        if (!config.watch && hasError(results && results.diagnostics)) {
          process.exit(1);
        }

        if (config.watch) {
          process.once('SIGINT', () => {
            process.exit(0);
          });
        }
        break;

      case 'docs':
        await compiler.docs();
        break;

      default:
        config.logger.error(`Invalid stencil command, please see the options below:`);
        help(process, logger);
        process.exit(1);
    }

  } catch (e) {
    config.logger.error('uncaught cli error: ' + e);
    process.exit(1);
  }
}

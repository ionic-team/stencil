import { BuildConfig, BuildResults, Logger, StencilSystem } from '../util/interfaces';
import { getConfigFilePath, hasError, overrideConfigFromArgv, parseArgv } from './cli-utils';
import { help } from './task-help';
import { initApp } from './task-init';


export function run(process: NodeJS.Process, sys: StencilSystem, logger: Logger, compiler: any) {
  const task = process.argv[2];
  const argv = parseArgv(process);

  process.on('unhandledRejection', (r: any) => logger.error(r));

  if (argv.help) {
    help(process, logger);
    return process.exit(0);
  }

  if (task === 'init') {
    initApp(process, sys, logger);
    return process.exit(0);
  }

  if (argv.version) {
    console.log(sys.compiler.version);
    return process.exit(0);
  }

  // load the config file
  let config: BuildConfig;
  try {
    const configPath = getConfigFilePath(process, sys, argv.config);
    config = sys.loadConfigFile(configPath);

  } catch (e) {
    logger.error(e);
    return process.exit(1);
  }

  // override the config values with any cli arguments
  overrideConfigFromArgv(config, argv);

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

  switch (task) {
    case 'build':
      compiler.build(config).then((results: BuildResults) => {
        if (!config.watch && hasError(results && results.diagnostics)) {
          process.exit(1);
        }

      }).catch((err: any) => {
        config.logger.error(err);
        process.exit(1);
      });

      if (config.watch) {
        process.once('SIGINT', () => {
          return process.exit(0);
        });
      }
      break;

    case 'docs':
      config.generateDocs = true;
      compiler.docs(config).catch((err: any) => {
        config.logger.error(err);
      });
      break;

    default:
      config.logger.error(`Invalid stencil command, please see the options below:`);
      help(process, logger);
      break;
  }
}

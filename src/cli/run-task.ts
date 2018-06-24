import * as d from '../declarations';
import { hasError } from './cli-utils';
import { helpTask } from './task-help';
import { serverTask } from './task-serve';


export async function runTask(process: NodeJS.Process, config: d.Config, compiler: any, flags: d.ConfigFlags) {
  switch (flags.task) {
    case 'build':
      const results = await compiler.build();
      if (!config.watch && hasError(results && results.diagnostics)) {
        config.sys.destroy();
        process.exit(1);
      }

      if (config.watch || (config.devServer && config.flags.serve)) {
        process.once('SIGINT', () => {
          config.sys.destroy();
          process.exit(0);
        });
      }
      return results;

    case 'docs':
      return compiler.docs();

    case 'serve':
      return serverTask(config, compiler);

    default:
      config.logger.error(`Invalid stencil command, please see the options below:`);
      helpTask(process, config.logger);
      process.exit(1);
  }
}

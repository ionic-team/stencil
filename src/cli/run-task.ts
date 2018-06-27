import * as d from '../declarations';
import { taskBuild } from './task-build';
import { taskDocs } from './task-docs';
import { taskHelp } from './task-help';
import { taskServe } from './task-serve';


export async function runTask(process: NodeJS.Process, config: d.Config, flags: d.ConfigFlags) {
  switch (flags.task) {
    case 'build':
      return taskBuild(process, config, flags);

    case 'docs':
      return taskDocs(process, config);

    case 'serve':
      return taskServe(process, config, flags);

    default:
      config.logger.error(`Invalid stencil command, please see the options below:`);
      taskHelp(process, config.logger);
      process.exit(1);
  }
}

import { Config, TaskCommand } from '../../declarations';
import { taskBuild } from './task-build';
import { taskGenerate } from './task-generate';
import { taskHelp } from './task-help';
import { taskServe } from './task-serve';
import { taskVersion } from './task-version';
import exit from 'exit';


export async function runTask(prcs: NodeJS.Process, config: Config, task: TaskCommand) {
  switch (task) {
    case 'build':
      await taskBuild(prcs, config);
      break;

    case 'docs':
      // await taskDocs(config);
      break;

    case 'serve':
      await taskServe(prcs, config);
      break;

    case 'test':
      // await taskTest(config);
      break;

    case 'generate':
      await taskGenerate(config);
      break;

    case 'version':
      taskVersion(config);
      break;

    case 'help':
      taskHelp(prcs, config);
      break;

    default:
      config.logger.error(`Invalid stencil command, please see the options below:`);
      taskHelp(prcs, config.logger);
      exit(1);
  }
}

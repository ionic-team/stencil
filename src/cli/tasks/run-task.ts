import { Config, TaskCommand } from '../../declarations';
import { taskBuild } from './task-build';
import { taskDocs } from './task-docs';
import { taskGenerate } from './task-generate';
import { taskHelp } from './task-help';
import { taskPrerender } from './task-prerender';
import { taskServe } from './task-serve';
import { taskTest } from './task-test';
import { taskVersion } from './task-version';
import exit from 'exit';

export async function runTask(prcs: NodeJS.Process, config: Config, task: TaskCommand) {
  switch (task) {
    case 'build':
      await taskBuild(prcs, config);
      break;

    case 'docs':
      await taskDocs(prcs, config);
      break;

    case 'generate':
    case 'g':
      await taskGenerate(config);
      break;

    case 'help':
      taskHelp(prcs, config);
      break;

    case 'prerender':
      await taskPrerender(prcs, config);
      break;

    case 'serve':
      await taskServe(prcs, config);
      break;

    case 'test':
      await taskTest(prcs, config);
      break;

    case 'version':
      await taskVersion();
      break;

    default:
      config.logger.error(`${prcs.platform !== 'win32' ? '❌ ' : ''} Invalid stencil command, please see the options below:`);
      taskHelp(prcs, config);
      exit(1);
  }
}

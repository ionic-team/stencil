import * as d from '@declarations';
import { logger } from '@sys';
import { taskBuild } from './task-build';
import { taskDocs } from './task-docs';
import { taskHelp } from './task-help';
import { taskServe } from './task-serve';
import { taskTest } from './task-test';
import { taskCheckVersion, taskVersion } from './task-version';
import exit from 'exit';


export async function runTask(process: NodeJS.Process, config: d.Config, flags: d.ConfigFlags) {
  if (flags.help || flags.task === `help`) {
    taskHelp(process);

  } else if (flags.version) {
    taskVersion();

  } else if (flags.checkVersion) {
    await taskCheckVersion();

  } else {
    switch (flags.task) {
      case 'build':
        await taskBuild(process, config, flags);
        break;

      case 'docs':
        await taskDocs(config);
        break;

      case 'serve':
        await taskServe(process, config, flags);
        break;

      case 'test':
        await taskTest(config);
        break;

      default:
        logger.error(`Invalid stencil command, please see the options below:`);
        taskHelp(process);
        exit(1);
    }
  }
}

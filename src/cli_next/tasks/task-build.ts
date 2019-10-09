import * as d from '../../declarations';
import { taskWatch } from './task-watch';


export async function taskBuild(prcs: NodeJS.Process, config: d.Config) {
  if (config.flags.watch) {
    await taskWatch(prcs, config);
    return;
  }

}

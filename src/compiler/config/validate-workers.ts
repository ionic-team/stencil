import * as d from '../../declarations';


export function validateWorkers(config: d.Config) {
  let cpus = 1;

  if (config.sys && config.sys.details && typeof config.sys.details.cpus === 'number') {
    cpus = config.sys.details.cpus;
  }

  if (typeof config.maxConcurrentWorkers !== 'number') {
    config.maxConcurrentWorkers = cpus;
  }

  if (config.flags && typeof config.flags.maxWorkers === 'number') {
    config.maxConcurrentWorkers = config.flags.maxWorkers;
  }

  config.maxConcurrentWorkers = Math.max(Math.min(config.maxConcurrentWorkers, cpus), 1);

  if (typeof config.maxConcurrentTasksPerWorker !== 'number') {
    config.maxConcurrentTasksPerWorker = DEFAULT_MAX_TASKS_PER_WORKER;
  }

  config.maxConcurrentTasksPerWorker = Math.max(Math.min(config.maxConcurrentTasksPerWorker, 20), 1);
}


const DEFAULT_MAX_TASKS_PER_WORKER = 2;

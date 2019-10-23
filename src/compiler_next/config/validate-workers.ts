import * as d from '../../declarations';


export const validateWorkers = (config: d.Config) => {
  if (typeof config.maxConcurrentWorkers !== 'number') {
    config.maxConcurrentWorkers = 4;
  }

  if (config.flags) {
    if (typeof config.flags.maxWorkers === 'number') {
      config.maxConcurrentWorkers = config.flags.maxWorkers;
    } else if (config.flags.ci) {
      config.maxConcurrentWorkers = 2;
    }
  }

  config.maxConcurrentWorkers = Math.max(Math.min(config.maxConcurrentWorkers, 16), 1);
};

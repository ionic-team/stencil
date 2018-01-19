import { Config, CopyTasks } from '../../util/interfaces';


export function validateCopy(config: Config) {
  if (config.copy) {
    // merge user copy tasks into the default
    config.copy = Object.assign({}, DEFAULT_COPY_TASKS, config.copy);

  } else if (config.copy === null || (config.copy as any) === false) {
    // manually forcing to skip the copy task
    config.copy = null;

  } else {
    // use the default copy tasks
    config.copy = Object.assign({}, DEFAULT_COPY_TASKS);
  }
}


const DEFAULT_COPY_TASKS: CopyTasks = {
  assets: { src: 'assets', warn: false },
  manifestJson: { src: 'manifest.json', warn: false }
};

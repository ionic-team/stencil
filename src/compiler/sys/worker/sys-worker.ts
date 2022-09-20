import { isFunction } from '@utils';

import type { ValidatedConfig } from '../../../declarations';
import { createWorkerMainContext } from '../../worker/main-thread';
import { createWorkerContext } from '../../worker/worker-thread';

export const createSysWorker = (config: ValidatedConfig) => {
  if (
    isFunction(config.sys.createWorkerController) &&
    config.maxConcurrentWorkers > 0 &&
    config.sys.hardwareConcurrency > 1
  ) {
    const workerCtrl = config.sys.createWorkerController(config.maxConcurrentWorkers);

    config.sys.addDestroy(() => workerCtrl.destroy());

    config.logger.debug(`create workers, maxWorkers: ${workerCtrl.maxWorkers}`);
    return createWorkerMainContext(workerCtrl);
  }

  config.logger.debug(
    `no workers, maxConcurrentWorkers: ${config.maxConcurrentWorkers}, hardwareConcurrency: ${config.sys.hardwareConcurrency}`
  );
  return createWorkerContext(config.sys);
};

import { CompilerSystem } from '../../../declarations';
import { createWorkerContext } from '../../worker/worker-thread';
import { createWorkerMainContext } from '../../worker/main-thread';


export const createSysWorker = (sys: CompilerSystem, maxConcurrentWorkers: number) => {
  if (sys.createWorker == null || maxConcurrentWorkers < 1) {
    return createWorkerContext();
  }

  const workerCtrl = sys.createWorker(maxConcurrentWorkers);

  sys.addDestory(() => workerCtrl.destroy());

  return createWorkerMainContext(workerCtrl);
};

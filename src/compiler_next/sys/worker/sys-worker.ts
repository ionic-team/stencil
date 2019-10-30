import { BuildEvents, CompilerSystem } from '../../../declarations';
import { createWorkerContext } from '../../worker/worker-thread';
import { createWorkerMainContext } from '../../worker/main-thread';


export const createSysWorker = (sys: CompilerSystem, events: BuildEvents, maxConcurrentWorkers: number) => {
  if (sys.createWorker == null || maxConcurrentWorkers < 1) {
    return createWorkerContext(events);
  }

  const workerCtrl = sys.createWorker(maxConcurrentWorkers, events);

  sys.addDestory(() => workerCtrl.destroy());

  return createWorkerMainContext(workerCtrl, events);
};

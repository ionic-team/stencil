import { BuildEvents, CompilerSystem } from '../../declarations';
import { createWorkerMainContext } from './main-thread';
import { createWorkerContext } from './worker-thread';


export const createSysWorker = (sys: CompilerSystem, events: BuildEvents, maxConcurrentWorkers: number) => {
  if (sys.createWorker == null || maxConcurrentWorkers < 1) {
    return createWorkerContext(events);
  }

  const workerCtrl = sys.createWorker(maxConcurrentWorkers);
  return createWorkerMainContext(workerCtrl, events);
};

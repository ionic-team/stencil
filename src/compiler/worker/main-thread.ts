import { CompilerWorkerContext, WorkerMainController } from '../../declarations';

export const createWorkerMainContext = (workerCtrl: WorkerMainController): CompilerWorkerContext => ({
  optimizeCss: workerCtrl.handler('optimizeCss'),
  prepareModule: workerCtrl.handler('prepareModule'),
  prerenderWorker: workerCtrl.handler('prerenderWorker'),
  transformCssToEsm: workerCtrl.handler('transformCssToEsm'),
});

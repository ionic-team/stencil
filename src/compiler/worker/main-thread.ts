import { CompilerWorkerContext, WorkerMainController } from '../../declarations';

export const createWorkerMainContext = (workerCtrl: WorkerMainController): CompilerWorkerContext => {
  return {
    transpile: workerCtrl.handler('transpile'),
    optimizeCss: workerCtrl.handler('optimizeCss'),
    transformCssToEsm: workerCtrl.handler('transformCssToEsm'),
    transpileToEs5: workerCtrl.handler('transpileToEs5'),
    prepareModule: workerCtrl.handler('prepareModule'),
  };
};

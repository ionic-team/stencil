import { CompilerWorkerContext, WorkerMainController } from '../../declarations';


export const createWorkerMainContext = (workerCtrl: WorkerMainController): CompilerWorkerContext => {
  return {
    compileModule: workerCtrl.handler('compileModule'),
    minifyJs: workerCtrl.handler('compileModule'),
    optimizeCss: workerCtrl.handler('optimizeCss'),
    transformCssToEsm: workerCtrl.handler('transformCssToEsm'),
    transpileToEs5: workerCtrl.handler('transpileToEs5'),
    prepareModule: workerCtrl.handler('prepareModule'),
  };
};

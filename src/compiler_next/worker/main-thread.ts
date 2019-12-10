import { CompilerWorkerContext, WorkerMainController } from '../../declarations';


export const createWorkerMainContext = (workerCtrl: WorkerMainController): CompilerWorkerContext => {
  return {
    compileModule: (code, opts) => workerCtrl.send('compileModule', code, opts),
    minifyJs: (input, opts) => workerCtrl.send('minifyJs', input, opts),
    optimizeCss: (opts) => workerCtrl.send('optimizeCss', opts),
    transformCssToEsm: (input) => workerCtrl.send('transformCssToEsm', input),
  };
};

import { BuildEvents, CompilerWorkerContext, WorkerMainController } from '../../declarations';


export const createWorkerMainContext = (workerCtrl: WorkerMainController, events: BuildEvents): CompilerWorkerContext => {
  return {
    build: () => workerCtrl.send('build'),
    compileModule: (code, opts) => workerCtrl.send('compileModule', code, opts),
    createWatcher: () => workerCtrl.send('createWatcher').then(() => (
      {
        start: () => workerCtrl.send('watcherStart'),
        close: () => workerCtrl.send('watcherClose'),
        on: events.on,
      }
    )),
    destroy: () => workerCtrl.send('destroy').then(() => {
      workerCtrl.destroy();
    }),
    initCompiler: () => workerCtrl.send('initCompiler'),
    loadConfig: (config) => workerCtrl.send('loadConfig', config),
    minifyJs: (input, opts) => workerCtrl.send('minifyJs', input, opts),
    optimizeCss: (opts) => workerCtrl.send('optimizeCss', opts),
    scopeCss: (cssText, scopeId, commentOriginalSelector) => workerCtrl.send('scopeCss', cssText, scopeId, commentOriginalSelector),
    sysAccess: (p) => workerCtrl.send('sysAccess', p),
    sysMkdir: (p) => workerCtrl.send('sysMkdir', p),
    sysReadFile: (p) => workerCtrl.send('sysReadFile', p),
    sysReaddir: (p) => workerCtrl.send('sysReaddir', p),
    sysRmdir: (p) => workerCtrl.send('sysRmdir', p),
    sysStat: (p) => workerCtrl.send('sysStat', p),
    sysUnlink: (p) => workerCtrl.send('sysUnlink', p),
    sysWriteFile: (p, content) => workerCtrl.send('sysWriteFile', p, content),
    watcherClose: () => workerCtrl.send('watcherClose'),
    watcherStart: () => workerCtrl.send('watcherStart'),
  };
};
